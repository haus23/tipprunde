import { createServerOnlyFn } from "@tanstack/react-start";
import { and, count, eq } from "drizzle-orm";

import { db } from "#db";

import { matches, rounds, tips } from "../schema/tables.ts";

export type Tip = typeof tips.$inferSelect;

export const getTipsByRoundAndUser = createServerOnlyFn(
  async ({ roundId, userId }: { roundId: number; userId: number }) => {
    const roundMatches = await db.query.matches.findMany({ where: { roundId } });
    const matchIds = roundMatches.map((m) => m.id);
    if (matchIds.length === 0) return [];
    return db.query.tips.findMany({
      where: { userId, matchId: { in: matchIds } },
    });
  },
);

export const getJokerCount = createServerOnlyFn(
  async ({ userId, championshipId }: { userId: number; championshipId: number }) => {
    const result = await db
      .select({ count: count() })
      .from(tips)
      .innerJoin(matches, eq(tips.matchId, matches.id))
      .innerJoin(rounds, eq(matches.roundId, rounds.id))
      .where(and(eq(tips.userId, userId), eq(rounds.championshipId, championshipId), eq(tips.joker, true)));
    return result[0]?.count ?? 0;
  },
);

export const upsertTip = createServerOnlyFn(
  async (data: { matchId: number; userId: number; tip: string | null; joker: boolean | null }) => {
    return db
      .insert(tips)
      .values(data)
      .onConflictDoUpdate({
        target: [tips.matchId, tips.userId],
        set: { tip: data.tip, joker: data.joker },
      });
  },
);
