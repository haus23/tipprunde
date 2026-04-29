import { createServerFn } from "@tanstack/react-start";
import { eq, sum } from "drizzle-orm";
import * as v from "valibot";

import { computeRanking } from "#/domain/ranking.ts";
import { db } from "#db";
import { getPlayers } from "#db/dal/players.ts";
import { matches, rounds, tips } from "#db/schema/tables.ts";

export const fetchRankingFn = createServerFn({ method: "GET" })
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }) => {
    const allPlayers = await getPlayers(championshipId);

    const pointRows = await db
      .select({ userId: tips.userId, points: sum(tips.points) })
      .from(tips)
      .innerJoin(matches, eq(tips.matchId, matches.id))
      .innerJoin(rounds, eq(matches.roundId, rounds.id))
      .where(eq(rounds.championshipId, championshipId))
      .groupBy(tips.userId);

    const playerPoints = allPlayers.map((p) => ({
      userId: p.userId,
      name: p.user?.name ?? "",
      points: Number(pointRows.find((r) => r.userId === p.userId)?.points ?? 0),
    }));

    const ranked = computeRanking(playerPoints);
    return ranked.map((entry) => ({
      ...entry,
      name: playerPoints.find((p) => p.userId === entry.userId)!.name,
    }));
  });
