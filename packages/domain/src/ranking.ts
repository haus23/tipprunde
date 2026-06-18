import { EXTRA_QUESTION_RULES } from "./rules.ts";

export type ExtraQuestionRuleId = (typeof EXTRA_QUESTION_RULES)[number]["value"];

// --- Input / Output ---

export type RankingInput = {
  /** Enrolled players — defines who appears in the ranking, even with 0 points. */
  players: { userId: number }[];
  /** Tip rows scoped to the championship. `points` is null until the match is scored. */
  tips: { userId: number; points: number | null }[];
  /** Extra-answer rows scoped to the championship. `points` is null until graded. */
  extraAnswers: { userId: number; points: number | null }[];
  /** Round bonus/malus rows scoped to the championship. Omit when no round rule is active. */
  roundPoints?: { userId: number; points: number }[];
  ruleset: { extraQuestionRuleId: string };
  championship: { extraQuestionPointsPublished: boolean };
};

export type RankingEntry = {
  userId: number;
  tipPoints: number;
  extraQuestionPoints: number;
  roundPoints: number;
  total: number;
  /** Tie-aware rank: equal totals share a rank, the next rank skips accordingly. */
  rank: number;
};

// --- Ranking ---

/**
 * Whether the ruleset includes extra questions at all — i.e. the championship
 * has a Zusatzfragen feature. Independent of whether their points are published
 * into the ranking. Gates the Zusatzfragen view.
 */
export function hasExtraQuestions(ruleset: RankingInput["ruleset"]): boolean {
  return ruleset.extraQuestionRuleId === ("mit-zusatzfragen" satisfies ExtraQuestionRuleId);
}

/**
 * Whether extra-answer points count toward the ranking: the ruleset must
 * include extra questions AND the championship must have published their points
 * (`extraQuestionPointsPublished`). Gates the ranking total and the Tabelle's
 * extras column.
 */
export function includesExtraQuestions(
  ruleset: RankingInput["ruleset"],
  championship: RankingInput["championship"],
): boolean {
  return hasExtraQuestions(ruleset) && championship.extraQuestionPointsPublished;
}

/**
 * Compute the championship ranking from already-scored points.
 *
 * Tip and extra-answer points are persisted at scoring time, so this is pure
 * aggregation: sum each player's tip points, conditionally add extra-answer
 * points, then assign tie-aware ranks by descending total.
 *
 * Extra-answer points only count when the ruleset includes extra questions
 * AND the championship has published them — otherwise they are ignored.
 */
export function calcRanking(input: RankingInput): RankingEntry[] {
  const { players, tips, extraAnswers, roundPoints, ruleset, championship } = input;

  const includeExtras = includesExtraQuestions(ruleset, championship);

  const tipPointsByUser = sumPointsByUser(tips);
  const extraPointsByUser = includeExtras
    ? sumPointsByUser(extraAnswers)
    : new Map<number, number>();
  const roundPointsByUser = roundPoints ? sumPointsByUser(roundPoints) : new Map<number, number>();

  const totals = players.map((p) => {
    const tipPoints = tipPointsByUser.get(p.userId) ?? 0;
    const extraQuestionPoints = extraPointsByUser.get(p.userId) ?? 0;
    const roundPts = roundPointsByUser.get(p.userId) ?? 0;
    return {
      userId: p.userId,
      tipPoints,
      extraQuestionPoints,
      roundPoints: roundPts,
      total: tipPoints + extraQuestionPoints + roundPts,
    };
  });

  return totals
    .toSorted((a, b) => b.total - a.total)
    .reduce<RankingEntry[]>((acc, entry, index) => {
      const prev = acc.at(-1);
      const rank = prev && prev.total === entry.total ? prev.rank : index + 1;
      acc.push({ ...entry, rank });
      return acc;
    }, []);
}

function sumPointsByUser(rows: { userId: number; points: number | null }[]): Map<number, number> {
  const byUser = new Map<number, number>();
  for (const row of rows) {
    if (row.points === null) continue;
    byUser.set(row.userId, (byUser.get(row.userId) ?? 0) + row.points);
  }
  return byUser;
}
