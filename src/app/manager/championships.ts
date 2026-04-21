import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { managerMiddleware } from "#/app/(auth)/guards.ts";
import { validateForm } from "#/utils/validate-form.ts";
import {
  createChampionship,
  getChampionship,
  getChampionships,
  getLatestChampionship,
  updateChampionship,
} from "#db/dal/championships.ts";

export type ChampionshipFormState = { success: true; slug: string } | { error: string } | null;

const championshipSchema = v.object({
  slug: v.string(),
  name: v.string(),
  nr: v.pipe(v.string(), v.toNumber()),
  rulesetId: v.string(),
});

const updateChampionshipSchema = v.object({
  id: v.number(),
  published: v.optional(v.boolean()),
  extraQuestionsPublished: v.optional(v.boolean()),
  completed: v.optional(v.boolean()),
});

export const fetchChampionshipsFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getChampionships());

export const fetchCurrentChampionshipFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.optional(v.string()))
  .handler(async ({ data: slug }) => (slug ? getChampionship(slug) : getLatestChampionship()));

export const createChampionshipFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(championshipSchema))
  .handler(async ({ data }): Promise<ChampionshipFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await createChampionship(data.output);
      return { success: true, slug: data.output.slug };
    } catch {
      return { error: "Turnier konnte nicht angelegt werden." };
    }
  });

export const updateChampionshipFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(updateChampionshipSchema)
  .handler(async ({ data }) => {
    await updateChampionship(data);
  });
