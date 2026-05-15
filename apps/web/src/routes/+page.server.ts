import { getCurrentMatches } from "$lib/server/db/spiele";
import { getRanking } from "$lib/server/db/tabelle";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { championship } = await parent();

  if (!championship) {
    error(404, "Kein Turnier gefunden.");
  }

  return {
    ranking: await getRanking(championship.id),
    currentMatches: await getCurrentMatches(championship.id),
  };
};
