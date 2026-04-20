import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "#db";
import type { Ruleset } from "#db/dal/rulesets.ts";

import { championships } from "../schema/tables.ts";

export type Championship = typeof championships.$inferSelect & {
  ruleset: Ruleset | null;
};

const withRuleset = { ruleset: true } as const;

export const getChampionships = createServerOnlyFn(async () =>
  db.query.championships.findMany({
    orderBy: { nr: "desc" },
    with: withRuleset,
  }),
);

export const getChampionship = createServerOnlyFn(async (slug: string) =>
  db.query.championships.findFirst({
    where: { slug },
    with: withRuleset,
  }),
);

export const getLatestChampionship = createServerOnlyFn(async () =>
  db.query.championships.findFirst({
    orderBy: { nr: "desc" },
    with: withRuleset,
  }),
);

export const createChampionship = createServerOnlyFn(
  async (data: Omit<typeof championships.$inferInsert, "id">) =>
    db.insert(championships).values(data),
);

export const updateChampionship = createServerOnlyFn(
  async (data: Partial<typeof championships.$inferInsert> & { id: number }) => {
    const { id, ...rest } = data;
    return db.update(championships).set(rest).where(eq(championships.id, id));
  },
);
