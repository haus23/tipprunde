import { createServerOnlyFn } from "@tanstack/react-start";
import { eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { rounds } from "@/lib/db/schema.ts";

export const getChampionshipRounds = createServerOnlyFn(
  async (championshipId: number) =>
    db.query.rounds.findMany({
      where: { championshipId },
      orderBy: { nr: "asc" },
    }),
);

export const addRound = createServerOnlyFn(async (championshipId: number) => {
  const result = await db
    .select({ maxNr: max(rounds.nr) })
    .from(rounds)
    .where(eq(rounds.championshipId, championshipId));
  const nextNr = (result[0]?.maxNr ?? 0) + 1;
  return db.insert(rounds).values({ championshipId, nr: nextNr });
});

export const setRoundPublished = createServerOnlyFn(
  async (roundId: number, value: boolean) =>
    db.update(rounds).set({ published: value }).where(eq(rounds.id, roundId)),
);
