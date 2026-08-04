import { db } from "./db.server";

export type MatchdayTip = {
  nr: number;
  paarungShort: string;
  result: string | null;
  tip: string | null;
  isFlagged: boolean;
  points: number | null;
};

/**
 * The small "current matchday" window for one player: the last couple of played
 * matches plus the next upcoming ones, capped at four rows total.
 */
export async function getMatchdayTips(
  championshipId: number,
  userId: number,
): Promise<MatchdayTip[]> {
  const dated = await db.query.matches.findMany({
    where: { date: { isNotNull: true }, round: { championshipId, published: true } },
    orderBy: { date: "asc" },
    columns: { id: true, nr: true, result: true },
    with: {
      round: { columns: { tipsPublished: true } },
      hometeam: { columns: { shortName: true } },
      awayteam: { columns: { shortName: true } },
    },
  });

  const played = dated.filter((m) => m.result !== null);
  const upcoming = dated.filter((m) => m.result === null);
  const openCount = Math.min(upcoming.length, 4 - Math.min(played.length, 2));
  const closedCount = Math.min(played.length, 4 - openCount);
  const window = [...played.slice(played.length - closedCount), ...upcoming.slice(0, openCount)];

  const matchIds = window.map((m) => m.id);
  const tipRows =
    matchIds.length > 0
      ? await db.query.tips.findMany({
          where: { userId, matchId: { in: matchIds } },
          columns: { matchId: true, tip: true, points: true, joker: true, extraJoker: true },
        })
      : [];

  const tipByMatch = new Map(tipRows.map((t) => [t.matchId, t]));

  return window.map((m) => {
    // Tips stay hidden until the round publishes them.
    const userTip = m.round.tipsPublished ? (tipByMatch.get(m.id) ?? null) : null;
    return {
      nr: m.nr,
      paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
      result: m.result,
      tip: userTip?.tip ?? null,
      isFlagged: (userTip?.joker || userTip?.extraJoker) ?? false,
      points: userTip?.points ?? null,
    };
  });
}
