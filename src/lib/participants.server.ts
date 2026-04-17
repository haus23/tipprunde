import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq, max } from "drizzle-orm";
import { db } from "#db";
import { players } from "@/lib/db/schema.ts";

export const getChampionshipPlayers = createServerOnlyFn(
  async (championshipId: number) =>
    db.query.players.findMany({
      where: { championshipId },
      with: { user: true },
      orderBy: { nr: "asc" },
    }),
);

export const addPlayerToChampionship = createServerOnlyFn(
  async (championshipId: number, userId: number) => {
    const result = await db
      .select({ maxNr: max(players.nr) })
      .from(players)
      .where(eq(players.championshipId, championshipId));
    const nextNr = (result[0]?.maxNr ?? 0) + 1;
    return db.insert(players).values({ championshipId, userId, nr: nextNr });
  },
);

export const removePlayerFromChampionship = createServerOnlyFn(
  async (championshipId: number, userId: number) =>
    db
      .delete(players)
      .where(and(eq(players.championshipId, championshipId), eq(players.userId, userId))),
);
