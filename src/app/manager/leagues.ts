import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createLeague, getLeagues, updateLeague } from "#db/dal/leagues.ts";
import { managerMiddleware } from "#/app/(auth)/middleware.ts";
import { validateForm } from "@/lib/validate-form.ts";

export type LeagueFormState = { success: true } | { error: string } | null;

const leagueSchema = v.object({
  id: v.string(),
  name: v.string(),
  shortName: v.string(),
});

export const fetchLeaguesFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getLeagues());

export const createLeagueFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(leagueSchema))
  .handler(async ({ data }): Promise<LeagueFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await createLeague(data.output);
      return { success: true };
    } catch {
      return { error: "Liga konnte nicht angelegt werden. ID bereits vergeben?" };
    }
  });

export const updateLeagueFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(leagueSchema))
  .handler(async ({ data }): Promise<LeagueFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await updateLeague(data.output);
      return { success: true };
    } catch {
      return { error: "Liga konnte nicht gespeichert werden." };
    }
  });
