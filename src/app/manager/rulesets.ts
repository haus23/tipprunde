import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createRuleset, getRulesets, updateRuleset } from "#db/dal/rulesets.ts";
import { managerMiddleware } from "#/app/(auth)/guards.ts";
import { validateForm } from "@/lib/validate-form.ts";

export type RulesetFormState = { success: true } | { error: string } | null;

const rulesetSchema = v.object({
  id: v.string(),
  name: v.string(),
  description: v.string(),
  tipRuleId: v.string(),
  jokerRuleId: v.string(),
  matchRuleId: v.string(),
  roundRuleId: v.string(),
  extraQuestionRuleId: v.string(),
});

export const fetchRulesetsFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getRulesets());

export const createRulesetFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(rulesetSchema))
  .handler(async ({ data }): Promise<RulesetFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await createRuleset(data.output);
      return { success: true };
    } catch {
      return { error: "Regelwerk konnte nicht angelegt werden. ID bereits vergeben?" };
    }
  });

export const updateRulesetFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(rulesetSchema))
  .handler(async ({ data }): Promise<RulesetFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await updateRuleset(data.output);
      return { success: true };
    } catch {
      return { error: "Regelwerk konnte nicht gespeichert werden." };
    }
  });
