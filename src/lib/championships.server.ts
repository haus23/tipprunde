import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#db";
import { championships } from "@/lib/db/schema.ts";
import type { championships as championshipsSchema } from "@/lib/db/schema.ts";

type StatusField = "published" | "extraQuestionsPublished" | "completed";

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

export const getChampionshipWithRuleset = createServerOnlyFn(async (slug: string) =>
  db.query.championships.findFirst({ where: { slug }, with: { ruleset: true } }),
);

export const updateChampionshipStatus = createServerOnlyFn(
  async (slug: string, field: StatusField, value: boolean) => {
    const updates: Partial<Record<StatusField, boolean>> = { [field]: value };
    if (field === "completed" && value === true) {
      const championship = await db.query.championships.findFirst({
        where: { slug },
        with: { ruleset: true },
      });
      if (championship?.ruleset?.extraQuestionRuleId === "mit-zusatzfragen") {
        updates.extraQuestionsPublished = true;
      }
    }
    await db.update(championships).set(updates).where(eq(championships.slug, slug));
  },
);
