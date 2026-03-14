import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { rulesets } from "@/lib/db/schema.ts";
import type { rulesets as rulesetsSchema } from "@/lib/db/schema.ts";

type RulesetData = Omit<typeof rulesetsSchema.$inferSelect, never>;

export const getRulesets = createServerOnlyFn(async () =>
  db.query.rulesets.findMany({ orderBy: { name: "asc" } }),
);

export const createRuleset = createServerOnlyFn(async (data: RulesetData) =>
  db.insert(rulesets).values(data),
);

export const updateRuleset = createServerOnlyFn(
  async (data: RulesetData) => {
    const { id, ...rest } = data;
    return db.update(rulesets).set(rest).where(eq(rulesets.id, id));
  },
);
