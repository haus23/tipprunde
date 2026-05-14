import { getVerlauf } from "$lib/server/db/verlauf";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { championship } = await parent();

  if (!championship) {
    error(404, "Kein Turnier gefunden.");
  }

  return getVerlauf(championship.id);
};
