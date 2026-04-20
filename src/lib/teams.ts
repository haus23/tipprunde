import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createTeam, getTeams, updateTeam } from "#db/dal/teams.ts";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { validateForm } from "@/lib/validate-form.ts";

export type TeamFormState = { success: true } | { error: string } | null;

const teamSchema = v.object({
  id: v.pipe(v.string(), v.minLength(1)),
  name: v.pipe(v.string(), v.minLength(1)),
  shortName: v.pipe(v.string(), v.minLength(1)),
});

const updateTeamSchema = v.omit(teamSchema, ["id"]);

export const fetchTeams = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getTeams());

export const createTeamFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(teamSchema))
  .handler(async ({ data }): Promise<TeamFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await createTeam(data.output);
      return { success: true };
    } catch {
      return { error: "Team konnte nicht angelegt werden. Kennung bereits vergeben?" };
    }
  });

export const updateTeamFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(
    validateForm(v.object({ id: v.pipe(v.string(), v.minLength(1)), ...updateTeamSchema.entries })),
  )
  .handler(async ({ data }): Promise<TeamFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    try {
      await updateTeam(data.output);
      return { success: true };
    } catch {
      return { error: "Team konnte nicht gespeichert werden." };
    }
  });
