import { data } from "react-router";

import { getMatchdayTips } from "#/lib/spiele.server.ts";

import type { Route } from "./+types/matchday-tips";

/**
 * Resource route: the ranking table's per-player popover loads this on demand,
 * so the matchday tips never weigh down the table's own request.
 *
 * championshipId is a required query param, not inferred via
 * getPublishedChampionship() — the ranking table renders in the Archiv too,
 * where "published" no longer means "the one the caller is looking at".
 */
export async function loader({ params, request }: Route.LoaderArgs) {
  const userId = Number(params.userId);
  if (!Number.isInteger(userId) || userId <= 0) throw data("Ungültiger Spieler.", { status: 400 });

  const championshipId = Number(new URL(request.url).searchParams.get("championshipId"));
  if (!Number.isInteger(championshipId) || championshipId <= 0) {
    throw data("Ungültiges Turnier.", { status: 400 });
  }

  return { matches: await getMatchdayTips(championshipId, userId) };
}
