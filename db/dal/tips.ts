import { createServerOnlyFn } from "@tanstack/react-start";
import { and, eq, inArray } from "drizzle-orm";

import { db } from "#db";

import { matches, tips } from "../schema/tables.ts";

export type Tip = typeof tips.$inferSelect;

export const getTipsByRoundAndUser = createServerOnlyFn(
  async ({ roundId, userId }: { roundId: number; userId: number }) => {
    const roundMatches = await db
      .select({ id: matches.id })
      .from(matches)
      .where(eq(matches.roundId, roundId));
    const matchIds = roundMatches.map((m) => m.id);
    if (matchIds.length === 0) return [];
    return db
      .select()
      .from(tips)
      .where(and(inArray(tips.matchId, matchIds), eq(tips.userId, userId)));
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
