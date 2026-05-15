import { getSpieler } from "$lib/server/db/spieler";
import { getRanking } from "$lib/server/db/tabelle";
import { error, redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent, locals, setHeaders }) => {
  const { championship } = await parent();

  const ranking = await getRanking(championship.id);

  if (!params.slug) {
    const defaultSlug =
      (locals.user && ranking.find((p) => p.userId === locals.user!.id)?.slug) || ranking[0]?.slug;
    if (!defaultSlug) error(404, "Keine Spieler gefunden.");
    redirect(302, `/spieler/${defaultSlug}`);
  }

  setHeaders({ "cache-control": "s-maxage=60, stale-while-revalidate=600" });

  const slug = params.slug;
  const player = ranking.find((p) => p.slug === slug);
  if (!player) error(404, `Kein Spieler mit dem Kürzel „${slug}".`);

  const rounds = await getSpieler(championship.id, player.userId);

  const allMatches = rounds.flatMap((r) => r.matches);
  const matchesWithResult = allMatches.filter((m) => m.result !== null).length;
  const totalMatches = allMatches.length;
  const playerAvg = matchesWithResult > 0 ? (player.points / matchesWithResult).toFixed(2) : null;
  const playerSpiele =
    matchesWithResult === totalMatches ? `${totalMatches}` : `${matchesWithResult}/${totalMatches}`;

  const lastRoundWithResult = rounds.findLast((r) => r.matches.some((m) => m.result !== null));
  const defaultOpenRound = (lastRoundWithResult ?? rounds[0])?.nr ?? 1;

  return {
    ranking,
    player,
    rounds,
    stats: { playerSpiele, playerAvg, defaultOpenRound },
  };
};
