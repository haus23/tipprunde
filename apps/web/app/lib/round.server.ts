import {
  matches as matchesTable,
  roundPoints as roundPointsTable,
  rounds as roundsTable,
  tips as tipsTable,
} from "@tipprunde/db/schema";
import {
  calcGoalDeviation,
  isRoundCompletable,
  selectLowestSumMatches,
  type RoundRuleId,
} from "@tipprunde/domain/scoring";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "./db.server.ts";

/**
 * Apply (or revert) a round's round-level rule effects — the doubling from
 * "niedrigste Spielsumme" and the bonus/malus from "Torabweichung".
 *
 * Always reverts first (deletes round points / halves back doubled tip
 * points), which makes re-running this idempotent regardless of the round's
 * prior state — the same "revert, then reapply" shape `toggle-round-completed`
 * always used. Reapplies only when `completed` is true and the round rule
 * actually reaches this round (`isRoundCompletable`).
 *
 * Callers: the "Abgeschlossen" toggle in the championship overview (the
 * original, direct use), and — for a round already completed — anything that
 * changes what the round rule would compute, e.g. excluding a match from
 * scoring after the fact. Recomputing from scratch here rather than trying
 * to patch the old result is what makes both callers safe: the round rule
 * has no notion of "what changed", only "what the matches say now".
 */
export async function applyRoundRule(roundId: number, { completed }: { completed: boolean }) {
  const round = await db.query.rounds.findFirst({
    where: { id: roundId },
    columns: { nr: true, championshipId: true },
  });
  if (!round) return;

  const championship = await db.query.championships.findFirst({
    where: { id: round.championshipId },
    columns: { rulesetId: true },
  });
  const ruleset = championship?.rulesetId
    ? await db.query.rulesets.findFirst({
        where: { id: championship.rulesetId },
        columns: { roundRuleId: true },
      })
    : null;

  const roundRuleId = ruleset?.roundRuleId as RoundRuleId | undefined;
  const canComplete = isRoundCompletable(roundRuleId, round.nr);

  // The round rules are mutually exclusive per ruleset, so only one of
  // these branches ever does real work — each handles its own revert
  // (always, to make re-completing idempotent and un-completing a clean
  // rollback) and its own re-apply (only when completing a round it
  // actually reaches).
  if (roundRuleId === "torabweichung-bonus-malus") {
    await db.delete(roundPointsTable).where(eq(roundPointsTable.roundId, roundId));

    if (completed && canComplete) {
      // Fetch all matches in this round with results, nested with all tips
      const roundMatches = await db.query.matches.findMany({
        where: { roundId },
        columns: { id: true, result: true },
        with: {
          tips: { columns: { userId: true, tip: true } },
        },
      });

      const matchesWithResult = roundMatches.filter((m) => m.result !== null);

      if (matchesWithResult.length > 0) {
        // Collect all player userIds from tips across all matches
        const allUserIds = [
          ...new Set(matchesWithResult.flatMap((m) => m.tips.map((t) => t.userId))),
        ];

        // Calculate deviation sum per player
        const deviations = allUserIds.map((userId) => {
          const sum = matchesWithResult.reduce((acc, m) => {
            const tip = m.tips.find((t) => t.userId === userId);
            return acc + calcGoalDeviation(tip?.tip ?? null, m.result!);
          }, 0);
          return { userId, sum };
        });

        if (deviations.length > 0) {
          const minDev = Math.min(...deviations.map((d) => d.sum));
          const maxDev = Math.max(...deviations.map((d) => d.sum));

          const entries: { roundId: number; userId: number; points: number }[] = [];
          for (const { userId, sum } of deviations) {
            if (sum === minDev && minDev !== maxDev) entries.push({ roundId, userId, points: 1 });
            else if (sum === maxDev && minDev !== maxDev)
              entries.push({ roundId, userId, points: -1 });
          }
          if (entries.length > 0) {
            await db.insert(roundPointsTable).values(entries);
          }
        }
      }
    }
  } else if (
    roundRuleId === "niedrigste-spielsumme-doppelte-punkte" ||
    roundRuleId === "niedrigste-spielsumme-doppelte-punkte-ab-runde-3"
  ) {
    const bonusedMatches = await db.query.matches.findMany({
      where: { roundId, lowestSumBonus: true },
      columns: { id: true },
      with: { tips: { columns: { userId: true, points: true } } },
    });
    if (bonusedMatches.length > 0) {
      await Promise.all(
        bonusedMatches.flatMap((m) =>
          m.tips.map((tip) =>
            db
              .update(tipsTable)
              .set({ points: tip.points === null ? null : tip.points / 2 })
              .where(and(eq(tipsTable.matchId, m.id), eq(tipsTable.userId, tip.userId))),
          ),
        ),
      );
      await db
        .update(matchesTable)
        .set({ lowestSumBonus: null })
        .where(
          inArray(
            matchesTable.id,
            bonusedMatches.map((m) => m.id),
          ),
        );
    }

    if (completed && canComplete) {
      const roundMatches = await db.query.matches.findMany({
        where: { roundId },
        columns: { id: true, result: true },
        with: {
          tips: { columns: { userId: true, points: true } },
        },
      });

      const matchesWithResult = roundMatches.filter((m) => m.result !== null);

      if (matchesWithResult.length > 0) {
        const sums = matchesWithResult.map((m) => ({
          matchId: m.id,
          tipPointSum: m.tips.reduce((acc, t) => acc + (t.points ?? 0), 0),
        }));
        const bonusMatchIds = selectLowestSumMatches(sums);

        if (bonusMatchIds.length > 0) {
          const bonusMatches = matchesWithResult.filter((m) => bonusMatchIds.includes(m.id));
          await Promise.all(
            bonusMatches.flatMap((m) =>
              m.tips.map((tip) =>
                db
                  .update(tipsTable)
                  .set({ points: tip.points === null ? null : tip.points * 2 })
                  .where(and(eq(tipsTable.matchId, m.id), eq(tipsTable.userId, tip.userId))),
              ),
            ),
          );
          await db
            .update(matchesTable)
            .set({ lowestSumBonus: true })
            .where(inArray(matchesTable.id, bonusMatchIds));
        }
      }
    }
  }
}
