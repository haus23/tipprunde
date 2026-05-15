import { getCurrentMatches } from "$lib/server/db/spiele";
import { getRanking } from "$lib/server/db/tabelle";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, locals }) => {
  const { championship } = await parent();

  if (!championship) {
    error(404, "Kein Turnier gefunden.");
  }

  const fullRanking = await getRanking(championship.id);
  const top3 = fullRanking.slice(0, 3);

  const currentUserEntry = locals.user
    ? (fullRanking.find((e) => e.userId === locals.user.id) ?? null)
    : null;
  const userBelowTop3 =
    currentUserEntry && !top3.includes(currentUserEntry) ? currentUserEntry : null;

  const userRankingIndex = userBelowTop3 ? fullRanking.indexOf(userBelowTop3) : -1;

  return {
    userBelowTop3,
    userRankingIndex,
    ranking: top3,
    currentMatches: await getCurrentMatches(championship.id),
  };
};
