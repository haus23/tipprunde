import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { validateForm } from "@/lib/validate-form.ts";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { createRuleset, getRulesets, updateRuleset } from "#db/dal/rulesets.ts";

export type RegelwerkFormState = { success: true } | { error: string } | null;

const rulesetSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.pipe(v.string(), v.minLength(1)),
  tipRuleId: v.pipe(v.string(), v.minLength(1)),
  jokerRuleId: v.pipe(v.string(), v.minLength(1)),
  matchRuleId: v.pipe(v.string(), v.minLength(1)),
  roundRuleId: v.pipe(v.string(), v.minLength(1)),
  extraQuestionRuleId: v.pipe(v.string(), v.minLength(1)),
});

const updateRulesetSchema = v.omit(rulesetSchema, ["id"]);

export const fetchRulesets = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getRulesets());

export const createRegelwerk = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(rulesetSchema))
  .handler(async ({ data }): Promise<RegelwerkFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await createRuleset(data.output);
      return { success: true };
    } catch {
      return { error: "Regelwerk konnte nicht angelegt werden. ID bereits vergeben?" };
    }
  });

export const updateRegelwerk = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(
    validateForm(
      v.object({ id: v.pipe(v.string(), v.minLength(1)), ...updateRulesetSchema.entries }),
    ),
  )
  .handler(async ({ data }): Promise<RegelwerkFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await updateRuleset(data.output);
      return { success: true };
    } catch {
      return { error: "Regelwerk konnte nicht gespeichert werden." };
    }
  });
