import { matches, rounds, tips } from "@tipprunde/db/schema";
import { eq, sum } from "drizzle-orm";

import { db } from "./db.server";

/** Published rounds with their matches and the field's total points per match. */
export async function getRounds(championshipId: number) {
  const [roundRows, pointRows] = await Promise.all([
    db.query.rounds.findMany({
      where: { championshipId, published: true },
      orderBy: { nr: "asc" },
      columns: { id: true, nr: true },
      with: {
        matches: {
          orderBy: { nr: "asc" },
          columns: { id: true, nr: true, date: true, result: true, lowestSumBonus: true },
          with: {
            league: { columns: { shortName: true } },
            hometeam: { columns: { name: true, shortName: true } },
            awayteam: { columns: { name: true, shortName: true } },
          },
        },
      },
    }),
    // Total points the field earned per match — a flat aggregation scan.
    db
      .select({ matchId: tips.matchId, points: sum(tips.points) })
      .from(tips)
      .innerJoin(matches, eq(tips.matchId, matches.id))
      .innerJoin(rounds, eq(matches.roundId, rounds.id))
      .where(eq(rounds.championshipId, championshipId))
      .groupBy(tips.matchId),
  ]);

  const pointsByMatch = new Map(pointRows.map((r) => [r.matchId, Number(r.points ?? 0)]));

  return roundRows.map((r) => ({
    nr: r.nr,
    matches: r.matches.map((m) => ({
      id: m.id,
      nr: m.nr,
      date: m.date,
      liga: m.league?.shortName ?? null,
      paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
      paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
      result: m.result,
      // Stored points are doubled for a lowestSumBonus match — show the raw
      // sum the field actually scored, the one the bonus was picked from.
      points:
        m.result !== null
          ? m.lowestSumBonus
            ? (pointsByMatch.get(m.id) ?? 0) / 2
            : (pointsByMatch.get(m.id) ?? 0)
          : null,
      lowestSumBonus: m.lowestSumBonus ?? false,
    })),
  }));
}

export type SpieleRound = Awaited<ReturnType<typeof getRounds>>[number];

/** One match with every player's tip, plus its neighbours for prev/next nav. */
export async function getMatch(championshipId: number, nr: number) {
  const [match, prev, next] = await Promise.all([
    db.query.matches.findFirst({
      where: { nr, round: { championshipId, published: true } },
      columns: { nr: true, date: true, result: true, lowestSumBonus: true },
      with: {
        round: { columns: { tipsPublished: true } },
        league: { columns: { name: true } },
        hometeam: { columns: { name: true, shortName: true } },
        awayteam: { columns: { name: true, shortName: true } },
        // All tips for this match; joined to the ranking by userId in the view.
        tips: {
          columns: { userId: true, tip: true, points: true, joker: true, extraJoker: true },
        },
      },
    }),
    // Nearest lower/higher match number — null at the ends.
    db.query.matches.findFirst({
      where: { nr: { lt: nr }, round: { championshipId, published: true } },
      orderBy: { nr: "desc" },
      columns: { nr: true },
    }),
    db.query.matches.findFirst({
      where: { nr: { gt: nr }, round: { championshipId, published: true } },
      orderBy: { nr: "asc" },
      columns: { nr: true },
    }),
  ]);
  if (!match) return null;

  // The aggregate stays the raw, pre-bonus figure — same reasoning as
  // getRounds() above, it's what explains the match being picked. Individual
  // tips are returned as stored (i.e. doubled for a lowestSumBonus match):
  // the detail view shows each player's real, counted points.
  const rawSum = match.result !== null ? match.tips.reduce((s, t) => s + (t.points ?? 0), 0) : null;
  const points = rawSum !== null && match.lowestSumBonus ? rawSum / 2 : rawSum;

  return {
    nr: match.nr,
    date: match.date,
    liga: match.league?.name ?? null,
    paarung: `${match.hometeam?.name ?? "–"} – ${match.awayteam?.name ?? "–"}`,
    paarungShort: `${match.hometeam?.shortName ?? "–"} – ${match.awayteam?.shortName ?? "–"}`,
    result: match.result,
    points,
    lowestSumBonus: match.lowestSumBonus ?? false,
    prevNr: prev?.nr ?? null,
    nextNr: next?.nr ?? null,
    tipsPublished: match.round.tipsPublished,
    tips: match.tips,
  };
}

export type MatchDetail = NonNullable<Awaited<ReturnType<typeof getMatch>>>;

export type MatchdayTip = {
  nr: number;
  paarungShort: string;
  result: string | null;
  tip: string | null;
  isFlagged: boolean;
  points: number | null;
  lowestSumBonus: boolean;
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
    columns: { id: true, nr: true, result: true, lowestSumBonus: true },
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
      lowestSumBonus: m.lowestSumBonus ?? false,
    };
  });
}

/**
 * A window of up to 4 matches around "now": prefer 2 played + 2 upcoming,
 * backfilling from whichever side has fewer.
 */
export async function getCurrentMatches(championshipId: number) {
  const dated = await db.query.matches.findMany({
    where: { date: { isNotNull: true }, round: { championshipId, published: true } },
    orderBy: { date: "asc" },
    columns: { nr: true, date: true, result: true },
    with: {
      hometeam: { columns: { name: true, shortName: true } },
      awayteam: { columns: { name: true, shortName: true } },
    },
  });

  const played = dated.filter((m) => m.result !== null);
  const upcoming = dated.filter((m) => m.result === null);
  const openCount = Math.min(upcoming.length, 4 - Math.min(played.length, 2));
  const closedCount = Math.min(played.length, 4 - openCount);
  const window = [...played.slice(played.length - closedCount), ...upcoming.slice(0, openCount)];

  return window.map((m) => ({
    nr: m.nr,
    date: m.date,
    paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
    paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
    result: m.result,
  }));
}

export type CurrentMatch = Awaited<ReturnType<typeof getCurrentMatches>>[number];
