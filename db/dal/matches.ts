import { createServerOnlyFn } from "@tanstack/react-start";
import { eq, max } from "drizzle-orm";

import { db } from "#db";

import { matches, rounds } from "../schema/tables.ts";

export type Match = typeof matches.$inferSelect;

export const getMatches = createServerOnlyFn(async (roundId: number) =>
  db.query.matches.findMany({
    where: { roundId },
    orderBy: { nr: "asc" },
  }),
);

export const getMaxMatchNr = createServerOnlyFn(async (championshipId: number) => {
  const [{ maxNr }] = await db
    .select({ maxNr: max(matches.nr) })
    .from(matches)
    .innerJoin(rounds, eq(matches.roundId, rounds.id))
    .where(eq(rounds.championshipId, championshipId));
  return maxNr ?? 0;
});

export const createMatch = createServerOnlyFn(
  async (data: Omit<typeof matches.$inferInsert, "id">) => {
    return db.insert(matches).values(data);
  },
);

export const updateMatch = createServerOnlyFn(
  async (data: Partial<typeof matches.$inferInsert> & { id: number }) => {
    const { id, ...rest } = data;
    return db.update(matches).set(rest).where(eq(matches.id, id));
  },
);

export const getMatchWithRuleset = createServerOnlyFn(async (matchId: number) =>
  db.query.matches.findFirst({
    where: { id: matchId },
    with: { round: { with: { championship: { with: { ruleset: true } } } } },
  }),
);
