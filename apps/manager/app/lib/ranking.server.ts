import {
  extraAnswers,
  extraQuestions,
  matches,
  players as playersTable,
  rounds,
  tips,
} from "@tipprunde/db/schema";
import { calcRanking, includesExtraQuestions } from "@tipprunde/domain/ranking";
import { eq } from "drizzle-orm";

import { db } from "#/lib/db.server.ts";

/**
 * Recalculate and persist the ranking for all enrolled players in a
 * championship. Called after any write that affects tip points or
 * extra-question points.
 */
export async function updateRanking(championshipId: number): Promise<void> {
  const [championship, enrolledPlayers, tipRows, extraRows] = await Promise.all([
    db.query.championships.findFirst({
      where: { id: championshipId },
      columns: { extraQuestionPointsPublished: true },
      with: { ruleset: { columns: { extraQuestionRuleId: true } } },
    }),
    db.query.players.findMany({
      where: { championshipId },
      columns: { id: true, userId: true },
    }),
    db
      .select({ userId: tips.userId, points: tips.points })
      .from(tips)
      .innerJoin(matches, eq(tips.matchId, matches.id))
      .innerJoin(rounds, eq(matches.roundId, rounds.id))
      .where(eq(rounds.championshipId, championshipId)),
    db
      .select({ userId: extraAnswers.userId, points: extraAnswers.points })
      .from(extraAnswers)
      .innerJoin(extraQuestions, eq(extraAnswers.extraQuestionId, extraQuestions.id))
      .where(eq(extraQuestions.championshipId, championshipId)),
  ]);

  if (!championship || enrolledPlayers.length === 0) return;

  const ruleset = { extraQuestionRuleId: championship.ruleset.extraQuestionRuleId };
  const flags = { extraQuestionPointsPublished: championship.extraQuestionPointsPublished };
  const includeExtras = includesExtraQuestions(ruleset, flags);

  const entries = calcRanking({
    players: enrolledPlayers.map((p) => ({ userId: p.userId })),
    tips: tipRows,
    extraAnswers: extraRows,
    ruleset,
    championship: flags,
  });

  const entriesByUser = new Map(entries.map((e) => [e.userId, e]));

  await Promise.all(
    enrolledPlayers.map((p) => {
      const entry = entriesByUser.get(p.userId);
      if (!entry) return Promise.resolve();
      return db
        .update(playersTable)
        .set({
          rank: entry.rank,
          tipPoints: entry.tipPoints,
          extraQuestionPoints: includeExtras ? entry.extraQuestionPoints : null,
          total: entry.total,
        })
        .where(eq(playersTable.id, p.id));
    }),
  );
}
