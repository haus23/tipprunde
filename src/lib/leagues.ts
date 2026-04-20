import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createLeague, getLeagues, updateLeague } from "#db/dal/leagues.ts";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { validateForm } from "@/lib/validate-form.ts";

export type LigaFormState = { success: true } | { error: string } | null;

const ligaSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  shortName: v.pipe(v.string(), v.minLength(1)),
});

const updateLigaSchema = v.omit(ligaSchema, ["id"]);

export const fetchLeagues = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getLeagues());

export const createLiga = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(ligaSchema))
  .handler(async ({ data }): Promise<LigaFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await createLeague(data.output);
      return { success: true };
    } catch {
      return { error: "Liga konnte nicht angelegt werden. ID bereits vergeben?" };
    }
  });

export const updateLiga = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(
    validateForm(v.object({ id: v.pipe(v.string(), v.minLength(1)), ...updateLigaSchema.entries })),
  )
  .handler(async ({ data }): Promise<LigaFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await updateLeague(data.output);
      return { success: true };
    } catch {
      return { error: "Liga konnte nicht gespeichert werden." };
    }
  });
