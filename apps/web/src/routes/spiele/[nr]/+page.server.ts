import { getRoundsWithMatches } from "$lib/server/db/matches";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { championship } = await parent();

  if (!championship) {
    error(404, "Kein Turnier gefunden.");
  }

  const rounds = await getRoundsWithMatches(championship.id);

  const roundsWithMatches = rounds.map((r) => ({
    nr: r.nr,
    matches: r.matches.map((m) => ({
      nr: m.nr,
      paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
      paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
      points: m.result !== null ? m.tips.reduce((s, t) => s + (t.points ?? 0), 0) : null,
    })),
  }));

  return { roundsWithMatches };
};
