import { createServerOnlyFn } from "@tanstack/react-start";
import { eq, max } from "drizzle-orm";

import { db } from "#db";

import { rounds } from "../schema/tables.ts";

export type Round = typeof rounds.$inferSelect;

export const getRounds = createServerOnlyFn(async (championshipId: number) =>
  db.query.rounds.findMany({
    where: { championshipId },
    orderBy: { nr: "asc" },
  }),
);

export const createRound = createServerOnlyFn(async (championshipId: number) => {
  const [{ maxNr }] = await db
    .select({ maxNr: max(rounds.nr) })
    .from(rounds)
    .where(eq(rounds.championshipId, championshipId));
  const nextNr = (maxNr ?? 0) + 1;
  return db.insert(rounds).values({ championshipId, nr: nextNr });
});

export const updateRound = createServerOnlyFn(
  async (data: Partial<typeof rounds.$inferInsert> & { id: number }) => {
    const { id, ...rest } = data;
    return db.update(rounds).set(rest).where(eq(rounds.id, id));
  },
);
