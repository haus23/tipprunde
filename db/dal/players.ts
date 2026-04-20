import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq, max } from "drizzle-orm";

import { db } from "#db";
import type { User } from "#db/dal/users.ts";

import { players } from "../schema/tables.ts";

export type Player = typeof players.$inferSelect & {
  user: User | null;
};

export const getPlayers = createServerOnlyFn(async (championshipId: number) =>
  db.query.players.findMany({
    where: { championshipId },
    with: { user: true },
    orderBy: { nr: "asc" },
  }),
);

export const createPlayer = createServerOnlyFn(async (championshipId: number, userId: number) => {
  const [{ maxNr }] = await db
    .select({ maxNr: max(players.nr) })
    .from(players)
    .where(eq(players.championshipId, championshipId));
  const nextNr = (maxNr ?? 0) + 1;
  return db.insert(players).values({ championshipId, userId, nr: nextNr });
});

export const deletePlayer = createServerOnlyFn(async (championshipId: number, userId: number) =>
  db
    .delete(players)
    .where(and(eq(players.championshipId, championshipId), eq(players.userId, userId))),
);
