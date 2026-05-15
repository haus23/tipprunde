import { getRoundsWithMatches } from "$lib/server/db/matches";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent }) => {
  const { championship } = await parent();

  const rounds = await getRoundsWithMatches(championship.id);

  const lastRoundWithResult = rounds.findLast((r) => r.matches.some((m) => m.result !== null));
  const defaultOpenRound = (lastRoundWithResult ?? rounds[0])?.nr ?? 1;

  const roundsData = rounds.map((r) => ({
    nr: r.nr,
    matches: r.matches.map((m) => ({
      nr: m.nr,
      date: m.date,
      liga: m.league?.shortName ?? null,
      paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
      paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
      result: m.result,
      points: m.result !== null ? m.tips.reduce((s, t) => s + (t.points ?? 0), 0) : null,
    })),
  }));

  return { roundsData, defaultOpenRound };
};
