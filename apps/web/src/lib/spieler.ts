import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { db } from "#/lib/db.server.ts";

export const getPlayerMatches = createServerFn()
  .validator((data: { championshipId: number; userId: number }) => data)
  .handler(async ({ data: { championshipId, userId } }) => {
    const rounds = await db.query.rounds.findMany({
      where: { championshipId, published: true },
      orderBy: { nr: "asc" },
      columns: { id: true, nr: true, tipsPublished: true },
      with: {
        roundPoints: {
          where: { userId },
          columns: { points: true },
        },
        matches: {
          orderBy: { nr: "asc" },
          columns: { id: true, nr: true, date: true, result: true },
          with: {
            hometeam: { columns: { name: true, shortName: true } },
            awayteam: { columns: { name: true, shortName: true } },
            // Only this player's tip — points/joker are already persisted.
            tips: {
              where: { userId },
              columns: { tip: true, points: true, joker: true, extraJoker: true },
            },
          },
        },
      },
    });
    return { rounds };
  });

export type PlayerRound = Awaited<ReturnType<typeof getPlayerMatches>>["rounds"][number];
export type PlayerMatch = PlayerRound["matches"][number];

export const playerMatchesQueryOptions = (championshipId: number, userId: number) =>
  queryOptions({
    queryKey: ["player-matches", championshipId, userId],
    queryFn: () => getPlayerMatches({ data: { championshipId, userId } }),
  });
