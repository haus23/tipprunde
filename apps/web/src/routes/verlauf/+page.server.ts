import { getVerlauf } from "$lib/server/db/verlauf";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, setHeaders }) => {
  const { championship } = await parent();

  if (!championship) {
    error(404, "Kein Turnier gefunden.");
  }

  setHeaders({ "cache-control": "s-maxage=60, stale-while-revalidate=600" });

  return getVerlauf(championship.id);
};
