import {
  extraAnswers,
  extraQuestions,
  matches,
  roundPoints as roundPointsTable,
  rounds,
  tips,
} from "@tipprunde/db/schema";
import { calcProgression } from "@tipprunde/domain/progression";
import { includesExtraQuestions } from "@tipprunde/domain/ranking";
import { and, eq } from "drizzle-orm";

import { db } from "./db.server.ts";

/**
 * One position on the chart's x axis. Not a match-number scale: round points
 * and extra-question points get their own steps, so every point a player ever
 * scores has a place and the chart ends on the Abschlusstabelle.
 */
export type VerlaufStep =
  | { kind: "match"; nr: number }
  | { kind: "roundPoints"; roundNr: number }
  | { kind: "extraPoints" };

export type VerlaufPlayer = {
  userId: number;
  name: string;
  slug: string;
  /** Display row per played step, 0-based and unique — see calcProgression. */
  positions: number[];
  /** Tie-aware rank per played step, 1-based. */
  ranks: number[];
  /** Cumulative total per played step. */
  points: number[];
};

export type Verlauf = {
  steps: VerlaufStep[];
  /** Steps from here on have no data yet; lines stop before them. */
  playedSteps: number;
  /** Ordered by final display row, so the right-edge labels never overlap. */
  players: VerlaufPlayer[];
};

/**
 * The full rank progression of a championship, ready to plot.
 *
 * Unlike every other public view this aggregates at read time — the
 * materialized `players` columns only hold end-of-championship totals, never a
 * per-step history. That is a deliberate, documented exception: the largest
 * championship is under 900 tip rows, so this is four indexed queries and a
 * pass over ~1000 gains. See docs/verlauf-plan.md.
 */
export async function getVerlauf(championshipId: number): Promise<Verlauf> {
  const [championship, enrolled, publishedRounds, tipRows, roundPointRows, extraRows] =
    await Promise.all([
      db.query.championships.findFirst({
        where: { id: championshipId },
        columns: { extraQuestionPointsPublished: true },
        with: { ruleset: { columns: { extraQuestionRuleId: true } } },
      }),
      db.query.players.findMany({
        where: { championshipId },
        columns: { userId: true },
        with: { user: { columns: { name: true, slug: true } } },
      }),
      db.query.rounds.findMany({
        where: { championshipId, published: true },
        orderBy: { nr: "asc" },
        columns: { id: true, nr: true },
        with: {
          matches: { orderBy: { nr: "asc" }, columns: { id: true, nr: true, result: true } },
        },
      }),
      db
        .select({ matchId: tips.matchId, userId: tips.userId, points: tips.points })
        .from(tips)
        .innerJoin(matches, eq(tips.matchId, matches.id))
        .innerJoin(rounds, eq(matches.roundId, rounds.id))
        .where(and(eq(rounds.championshipId, championshipId), eq(rounds.published, true))),
      db
        .select({
          roundId: roundPointsTable.roundId,
          userId: roundPointsTable.userId,
          points: roundPointsTable.points,
        })
        .from(roundPointsTable)
        .innerJoin(rounds, eq(roundPointsTable.roundId, rounds.id))
        .where(and(eq(rounds.championshipId, championshipId), eq(rounds.published, true))),
      db
        .select({ userId: extraAnswers.userId, points: extraAnswers.points })
        .from(extraAnswers)
        .innerJoin(extraQuestions, eq(extraAnswers.extraQuestionId, extraQuestions.id))
        .where(eq(extraQuestions.championshipId, championshipId)),
    ]);

  const players = enrolled.map((p) => ({
    userId: p.userId,
    name: p.user?.name ?? "",
    slug: p.user?.slug ?? "",
  }));

  if (!championship || players.length === 0) {
    return { steps: [], playedSteps: 0, players: [] };
  }

  const tipsByMatch = groupBy(tipRows, (t) => t.matchId);
  const roundPointsByRound = groupBy(roundPointRows, (r) => r.roundId);

  const steps: VerlaufStep[] = [];
  const gains: { stepIndex: number; userId: number; points: number }[] = [];
  let playedSteps = 0;

  for (const round of publishedRounds) {
    for (const match of round.matches) {
      const stepIndex = steps.length;
      steps.push({ kind: "match", nr: match.nr });
      // An unplayed match still gets its step, so the axis shows the whole
      // season — it just carries no points and no line reaches it.
      if (match.result !== null) playedSteps = stepIndex + 1;
      for (const tip of tipsByMatch.get(match.id) ?? []) {
        if (tip.points !== null) gains.push({ stepIndex, userId: tip.userId, points: tip.points });
      }
    }

    // Only rounds that actually awarded bonus/malus get a column.
    const awarded = roundPointsByRound.get(round.id);
    if (awarded?.length) {
      const stepIndex = steps.length;
      steps.push({ kind: "roundPoints", roundNr: round.nr });
      playedSteps = stepIndex + 1;
      for (const entry of awarded) {
        gains.push({ stepIndex, userId: entry.userId, points: entry.points });
      }
    }
  }

  if (includesExtraQuestions(championship.ruleset, championship)) {
    const stepIndex = steps.length;
    steps.push({ kind: "extraPoints" });
    playedSteps = stepIndex + 1;
    for (const answer of extraRows) {
      if (answer.points !== null) {
        gains.push({ stepIndex, userId: answer.userId, points: answer.points });
      }
    }
  }

  const series = calcProgression({ players, gains, playedSteps });
  const byUser = new Map(series.map((s) => [s.userId, s]));

  const merged = players.map((player) => {
    const progression = byUser.get(player.userId);
    return {
      ...player,
      positions: progression?.positions ?? [],
      ranks: progression?.ranks ?? [],
      points: progression?.points ?? [],
    };
  });

  // Final row order — the right-edge labels sit at each line's last point, so
  // emitting them in row order keeps them from overlapping.
  merged.sort(
    (a, b) =>
      (a.positions.at(-1) ?? Number.MAX_SAFE_INTEGER) -
        (b.positions.at(-1) ?? Number.MAX_SAFE_INTEGER) || a.name.localeCompare(b.name, "de"),
  );

  return { steps, playedSteps, players: merged };
}

function groupBy<T, K>(rows: T[], key: (row: T) => K): Map<K, T[]> {
  const grouped = new Map<K, T[]>();
  for (const row of rows) {
    const list = grouped.get(key(row));
    if (list) list.push(row);
    else grouped.set(key(row), [row]);
  }
  return grouped;
}
