import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq } from "drizzle-orm";

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
    orderBy: { id: "asc" },
  }),
);

export const createPlayer = createServerOnlyFn(async (championshipId: number, userId: number) =>
  db.insert(players).values({ championshipId, userId }),
);

export const deletePlayer = createServerOnlyFn(async (championshipId: number, userId: number) =>
  db
    .delete(players)
    .where(and(eq(players.championshipId, championshipId), eq(players.userId, userId))),
);
