import { getRanking } from "$lib/server/db/ranking";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { championship } = await parent();

  if (!championship) {
    error(404, "Kein Turnier gefunden.");
  }

  const fullRanking = await getRanking(championship.id);
  return { ranking: fullRanking.slice(0, 3) };
};
