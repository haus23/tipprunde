import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { extraAnswers, extraQuestions, matches, rounds, tips } from "@tipprunde/db/schema";
import { calcRanking, includesExtraQuestions } from "@tipprunde/domain/ranking";
import { eq } from "drizzle-orm";

import { db } from "#/lib/db.server.ts";

export type RankedPlayer = {
  userId: number;
  name: string;
  slug: string;
  tipPoints: number;
  extraPoints: number;
  total: number;
  rank: number;
};

export const getRanking = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const [championship, players, tipRows, extraRows] = await Promise.all([
      db.query.championships.findFirst({
        where: { id: championshipId },
        columns: { extraQuestionsPublished: true },
        with: { ruleset: { columns: { extraQuestionRuleId: true } } },
      }),
      db.query.players.findMany({
        where: { championshipId },
        columns: { userId: true },
        with: { user: { columns: { name: true, slug: true } } },
        orderBy: { id: "asc" },
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

    if (!championship) return { ranking: [] as RankedPlayer[], showExtras: false };

    const ruleset = { extraQuestionRuleId: championship.ruleset.extraQuestionRuleId };
    const flags = { extraQuestionsPublished: championship.extraQuestionsPublished };

    const entries = calcRanking({
      players: players.map((p) => ({ userId: p.userId })),
      tips: tipRows,
      extraAnswers: extraRows,
      ruleset,
      championship: flags,
    });

    const userById = new Map(players.map((p) => [p.userId, p.user]));
    const ranking: RankedPlayer[] = entries.map((e) => ({
      ...e,
      name: userById.get(e.userId)?.name ?? "",
      slug: userById.get(e.userId)?.slug ?? "",
    }));

    return { ranking, showExtras: includesExtraQuestions(ruleset, flags) };
  });

export const rankingQueryOptions = (championshipId: number) =>
  queryOptions({
    queryKey: ["ranking", championshipId],
    queryFn: () => getRanking({ data: championshipId }),
  });
