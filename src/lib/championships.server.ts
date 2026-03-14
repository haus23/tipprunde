import { createServerOnlyFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { championships } from "@/lib/db/schema.ts";
import type { championships as championshipsSchema } from "@/lib/db/schema.ts";

type ChampionshipData = Pick<
  typeof championshipsSchema.$inferSelect,
  "slug" | "name" | "nr" | "rulesetId"
>;

export const getChampionships = createServerOnlyFn(async () =>
  db.query.championships.findMany({ orderBy: { nr: "desc" } }),
);

export const getChampionshipBySlug = createServerOnlyFn(async (slug: string) =>
  db.query.championships.findFirst({ where: { slug } }),
);

export const getLatestChampionship = createServerOnlyFn(async () =>
  db.query.championships.findFirst({ orderBy: { nr: "desc" } }),
);

export const getChampionshipsWithRulesets = createServerOnlyFn(async () =>
  db.query.championships.findMany({
    orderBy: { nr: "desc" },
    with: { ruleset: true },
  }),
);

export const createChampionship = createServerOnlyFn(async (data: ChampionshipData) =>
  db.insert(championships).values(data),
);
