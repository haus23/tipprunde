import { getMatchWithTips, getRoundsWithMatches } from "$lib/server/db/matches";
import { getRanking } from "$lib/server/db/ranking";
import { error } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent }) => {
  const { championship } = await parent();

  const nr = Number(params.nr);
  if (isNaN(nr)) error(404, "Keine gültige Spielnummer.");

  const [rounds, match, ranking] = await Promise.all([
    getRoundsWithMatches(championship.id),
    getMatchWithTips(championship.id, nr),
    getRanking(championship.id),
  ]);

  if (!match) error(404, `Kein Spiel mit Nummer ${nr} gefunden.`);

  const roundsWithMatches = rounds.map((r) => ({
    nr: r.nr,
    matches: r.matches.map((m) => ({
      nr: m.nr,
      paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
      paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
      points: m.result !== null ? m.tips.reduce((s, t) => s + (t.points ?? 0), 0) : null,
    })),
  }));

  const matchRound = rounds.find((r) => r.id === match.roundId);
  const tipsPublished = matchRound?.tipsPublished ?? false;

  const totalPoints = match.result ? match.tips.reduce((s, t) => s + (t.points ?? 0), 0) : null;

  const rankedTips = ranking.map((entry) => {
    const tip = match.tips.find((t) => t.userId === entry.userId);
    return {
      rank: entry.rank,
      userId: entry.userId,
      name: entry.name ?? "",
      slug: entry.slug ?? "",
      tip: tipsPublished ? (tip?.tip ?? null) : null,
      points: tipsPublished ? (tip?.points ?? null) : null,
      joker: tipsPublished ? (tip?.joker ?? null) : null,
    };
  });

  const matchData = {
    nr: match.nr,
    date: match.date,
    liga: match.league?.name ?? null,
    result: match.result,
    totalPoints,
    tipsPublished,
    rankedTips,
  };

  return { roundsWithMatches, matchData };
};
