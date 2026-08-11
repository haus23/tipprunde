import { data } from "react-router";

import { getPublishedChampionship } from "#/lib/championship.server.ts";
import { getMatchdayTips } from "#/lib/spiele.server.ts";

import type { Route } from "./+types/matchday-tips";

/**
 * Resource route: the ranking table's per-player popover loads this on demand,
 * so the matchday tips never weigh down the table's own request.
 */
export async function loader({ params }: Route.LoaderArgs) {
  const userId = Number(params.userId);
  if (!Number.isInteger(userId) || userId <= 0) throw data("Ungültiger Spieler.", { status: 400 });

  const championship = await getPublishedChampionship();
  if (!championship) return { matches: [] };

  return { matches: await getMatchdayTips(championship.id, userId) };
}
