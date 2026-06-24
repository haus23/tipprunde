import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { db } from "#/lib/db.server.ts";

export type RankedPlayer = {
  userId: number;
  name: string;
  slug: string;
  tipPoints: number;
  extraQuestionPoints: number;
  roundPoints: number | null;
  total: number;
  rank: number;
};

const getRanking = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const players = await db.query.players.findMany({
      where: { championshipId },
      columns: {
        userId: true,
        rank: true,
        tipPoints: true,
        extraQuestionPoints: true,
        roundPoints: true,
        total: true,
      },
      with: { user: { columns: { name: true, slug: true } } },
    });

    const ranking: RankedPlayer[] = players
      .filter((p) => p.rank !== null)
      .map((p) => ({
        userId: p.userId,
        name: p.user?.name ?? "",
        slug: p.user?.slug ?? "",
        tipPoints: p.tipPoints ?? 0,
        extraQuestionPoints: p.extraQuestionPoints ?? 0,
        roundPoints: p.roundPoints ?? null,
        total: p.total ?? 0,
        rank: p.rank!,
      }))
      .sort((a, b) => a.rank - b.rank);

    return ranking;
  });

export const rankingQueryOptions = (championshipId: number) =>
  queryOptions({
    queryKey: ["ranking", championshipId],
    queryFn: () => getRanking({ data: championshipId }),
  });

/** Player to show: explicit slug, else the logged-in user if enrolled, else rank 1. */
export function resolvePlayer(
  ranking: RankedPlayer[],
  slug: string | undefined,
  userId: number | undefined,
): RankedPlayer | undefined {
  if (slug) return ranking.find((p) => p.slug === slug);
  const self = userId !== undefined ? ranking.find((p) => p.userId === userId) : undefined;
  return self ?? ranking[0];
}
