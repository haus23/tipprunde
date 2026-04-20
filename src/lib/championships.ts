import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import {
  createChampionship,
  getChampionships,
  getChampionshipBySlug,
  getChampionshipWithRuleset,
  getChampionshipsWithRulesets,
  getLatestChampionship,
  updateChampionshipStatus,
} from "@/lib/championships.server.ts";
import { validateForm } from "@/lib/validate-form.ts";
import type { championships } from "#db/schema/tables.ts";

export const CHAMPIONSHIP_COOKIE = "current-championship";

export type Championship = typeof championships.$inferSelect;

export const fetchCurrentChampionship = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async (): Promise<Championship | null> => {
    const slug = getCookie(CHAMPIONSHIP_COOKIE);
    const championship = slug ? await getChampionshipBySlug(slug) : null;
    return championship ?? (await getLatestChampionship()) ?? null;
  });

export type TurnierFormState = { success: true; slug: string } | { error: string } | null;

const turnierSchema = v.object({
  slug: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  nr: v.pipe(v.string(), v.transform(Number)),
  rulesetId: v.pipe(v.string(), v.minLength(1)),
});

export const fetchChampionships = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getChampionships());

export const fetchTurniere = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getChampionshipsWithRulesets());

export const createTurnier = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(turnierSchema))
  .handler(async ({ data }): Promise<TurnierFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await createChampionship(data.output);
      return { success: true, slug: data.output.slug };
    } catch {
      return { error: "Turnier konnte nicht angelegt werden." };
    }
  });

export const fetchTurnierDetails = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.string())
  .handler(async ({ data: slug }) => getChampionshipWithRuleset(slug));

const statusSchema = v.object({
  slug: v.string(),
  field: v.union([v.literal("published"), v.literal("extraQuestionsPublished"), v.literal("completed")]),
  value: v.boolean(),
});

export const setTurnierStatus = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(statusSchema)
  .handler(async ({ data }) => updateChampionshipStatus(data.slug, data.field, data.value));

export const activateChampionship = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.string())
  .handler(async ({ data }): Promise<Championship | null> => {
    setCookie(CHAMPIONSHIP_COOKIE, data, { path: "/" });
    const championship = await getChampionshipBySlug(data);
    return championship ?? null;
  });
