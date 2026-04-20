import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#db";
import { rulesets } from "../schema/tables.ts";

export type Ruleset = typeof rulesets.$inferSelect;

export const getRulesets = createServerOnlyFn(async () =>
  db.query.rulesets.findMany({ orderBy: { name: "asc" } }),
);

export const createRuleset = createServerOnlyFn(async (data: typeof rulesets.$inferInsert) =>
  db.insert(rulesets).values(data),
);

export const updateRuleset = createServerOnlyFn(async (data: typeof rulesets.$inferInsert) => {
  const { id, ...rest } = data;
  return db.update(rulesets).set(rest).where(eq(rulesets.id, id));
});
