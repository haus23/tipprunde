import { data } from "react-router";
import { createTeam, getTeamById } from "~/lib/db/teams";
import type { Route } from "./+types/create";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const id = String(formData.get("id")).trim();
  const name = String(formData.get("name")).trim();
  const shortname = String(formData.get("shortname") || "").trim() || null;

  const errors: Record<string, string> = {};

  if (!id) {
    errors.id = "Kennung ist erforderlich";
  } else {
    const existingTeam = getTeamById(id);
    if (existingTeam) {
      errors.id = "Kennung bereits vergeben";
    }
  }

  if (!name) {
    errors.name = "Name ist erforderlich";
  }

  if (Object.keys(errors).length > 0) {
    return data({ success: false, errors }, { status: 400 });
  }

  createTeam({ id, name, shortname });
  return data({ success: true });
}
