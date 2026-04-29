import { createServerOnlyFn } from "@tanstack/react-start";

import { db } from "#db";

import { tips } from "../schema/tables.ts";

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
