import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { matches, rounds, tips } from "@tipprunde/db/schema";
import { eq, sum } from "drizzle-orm";

import { db } from "#/lib/db.server.ts";

export const getRounds = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const [roundRows, pointRows] = await Promise.all([
      db.query.rounds.findMany({
        where: { championshipId, published: true },
        orderBy: { nr: "asc" },
        columns: { id: true, nr: true },
        with: {
          matches: {
            orderBy: { nr: "asc" },
            columns: { id: true, nr: true, date: true, result: true },
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

    const roundsData = roundRows.map((r) => ({
      nr: r.nr,
      matches: r.matches.map((m) => ({
        id: m.id,
        nr: m.nr,
        date: m.date,
        liga: m.league?.shortName ?? null,
        paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
        paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
        result: m.result,
        points: m.result !== null ? (pointsByMatch.get(m.id) ?? 0) : null,
      })),
    }));

    return { rounds: roundsData };
  });

export type SpieleRound = Awaited<ReturnType<typeof getRounds>>["rounds"][number];

export const roundsQueryOptions = (championshipId: number) =>
  queryOptions({
    queryKey: ["spiele", championshipId],
    queryFn: () => getRounds({ data: championshipId }),
  });

export const getMatch = createServerFn()
  .validator((data: { championshipId: number; nr: number }) => data)
  .handler(async ({ data: { championshipId, nr } }) => {
    const [match, prev, next] = await Promise.all([
      db.query.matches.findFirst({
        where: { nr, round: { championshipId, published: true } },
        columns: { nr: true, date: true, result: true },
        with: {
          round: { columns: { tipsPublished: true } },
          league: { columns: { name: true } },
          hometeam: { columns: { name: true, shortName: true } },
          awayteam: { columns: { name: true, shortName: true } },
          // All tips for this match; joined to the ranking by userId in the view.
          tips: { columns: { userId: true, tip: true, points: true, joker: true } },
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
    if (!match) return { match: null };

    const points =
      match.result !== null ? match.tips.reduce((s, t) => s + (t.points ?? 0), 0) : null;

    return {
      match: {
        nr: match.nr,
        date: match.date,
        liga: match.league?.name ?? null,
        paarung: `${match.hometeam?.name ?? "–"} – ${match.awayteam?.name ?? "–"}`,
        paarungShort: `${match.hometeam?.shortName ?? "–"} – ${match.awayteam?.shortName ?? "–"}`,
        result: match.result,
        points,
        prevNr: prev?.nr ?? null,
        nextNr: next?.nr ?? null,
        tipsPublished: match.round.tipsPublished,
        tips: match.tips,
      },
    };
  });

export type MatchDetail = NonNullable<Awaited<ReturnType<typeof getMatch>>["match"]>;

export const matchQueryOptions = (championshipId: number, nr: number) =>
  queryOptions({
    queryKey: ["match", championshipId, nr],
    queryFn: () => getMatch({ data: { championshipId, nr } }),
  });

export const getCurrentMatches = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const dated = await db.query.matches.findMany({
      where: { date: { isNotNull: true }, round: { championshipId, published: true } },
      orderBy: { date: "asc" },
      columns: { nr: true, date: true, result: true },
      with: {
        hometeam: { columns: { name: true, shortName: true } },
        awayteam: { columns: { name: true, shortName: true } },
      },
    });

    // A window of up to 4 around "now": prefer 2 played + 2 upcoming, backfilling
    // from whichever side has fewer.
    const played = dated.filter((m) => m.result !== null);
    const upcoming = dated.filter((m) => m.result === null);
    const openCount = Math.min(upcoming.length, 4 - Math.min(played.length, 2));
    const closedCount = Math.min(played.length, 4 - openCount);
    const window = [...played.slice(played.length - closedCount), ...upcoming.slice(0, openCount)];

    return {
      matches: window.map((m) => ({
        nr: m.nr,
        date: m.date,
        paarung: `${m.hometeam?.name ?? "–"} – ${m.awayteam?.name ?? "–"}`,
        paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
        result: m.result,
      })),
    };
  });

export type CurrentMatch = Awaited<ReturnType<typeof getCurrentMatches>>["matches"][number];

export const currentMatchesQueryOptions = (championshipId: number) =>
  queryOptions({
    queryKey: ["current-matches", championshipId],
    queryFn: () => getCurrentMatches({ data: championshipId }),
  });

export const getMatchdayTips = createServerFn()
  .validator((data: { championshipId: number; userId: number }) => data)
  .handler(async ({ data: { championshipId, userId } }) => {
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
            columns: { matchId: true, tip: true, points: true, joker: true },
          })
        : [];

    const tipByMatch = new Map(tipRows.map((t) => [t.matchId, t]));

    return {
      matches: window.map((m) => {
        const userTip = m.round.tipsPublished ? (tipByMatch.get(m.id) ?? null) : null;
        return {
          nr: m.nr,
          paarungShort: `${m.hometeam?.shortName ?? "–"} – ${m.awayteam?.shortName ?? "–"}`,
          result: m.result,
          tip: userTip?.tip ?? null,
          isFlagged: userTip?.joker ?? false,
          points: userTip?.points ?? null,
        };
      }),
    };
  });

export const matchdayTipsQueryOptions = (championshipId: number, userId: number) =>
  queryOptions({
    queryKey: ["matchday-tips", championshipId, userId],
    queryFn: () => getMatchdayTips({ data: { championshipId, userId } }),
  });
