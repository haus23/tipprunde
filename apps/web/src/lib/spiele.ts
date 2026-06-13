import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { matches, rounds, tips } from "@tipprunde/db/schema";
import { eq, sum } from "drizzle-orm";

import { db } from "#/lib/db.server.ts";

export const getRounds = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const [roundRows, pointRows] = await Promise.all([
      db.query.rounds.findMany({
        where: { championshipId, published: true },
        orderBy: { nr: "asc" },
        columns: { id: true, nr: true },
        with: {
          matches: {
            orderBy: { nr: "asc" },
            columns: { id: true, nr: true, date: true, result: true },
            with: {
              league: { columns: { shortName: true } },
              hometeam: { columns: { name: true, shortName: true } },
              awayteam: { columns: { name: true, shortName: true } },
            },
          },
        },
      }),
      // Total points the field earned per match — a flat aggregation scan.
      db
        .select({ matchId: tips.matchId, points: sum(tips.points) })
        .from(tips)
        .innerJoin(matches, eq(tips.matchId, matches.id))
        .innerJoin(rounds, eq(matches.roundId, rounds.id))
        .where(eq(rounds.championshipId, championshipId))
        .groupBy(tips.matchId),
    ]);

    const pointsByMatch = new Map(pointRows.map((r) => [r.matchId, Number(r.points ?? 0)]));

    const roundsData = roundRows.map((r) => ({
      nr: r.nr,
      matches: r.matches.map((m) => ({
        id: m.id,
        nr: m.nr,
        date: m.date,
        liga: m.league?.shortName ?? null,
        paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
        paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
        result: m.result,
        points: m.result !== null ? (pointsByMatch.get(m.id) ?? 0) : null,
      })),
    }));

    return { rounds: roundsData };
  });

export type SpieleRound = Awaited<ReturnType<typeof getRounds>>["rounds"][number];

export const roundsQueryOptions = (championshipId: number) =>
  queryOptions({
    queryKey: ["spiele", championshipId],
    queryFn: () => getRounds({ data: championshipId }),
  });
