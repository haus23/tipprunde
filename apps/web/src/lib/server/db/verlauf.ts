import { inArray } from "drizzle-orm";

import { db, tips } from ".";

export type VerlaufPlayer = { userId: number; name: string };
export type PlayerPoint = { points: number; rank: number };
export type ChartPoint = { matchNr: number; players: Record<string, PlayerPoint> };

export async function getVerlauf(championshipId: number) {
  const players = await db.query.players.findMany({
    where: { championshipId },
    with: { user: true },
    orderBy: { id: "asc" },
  });

  const roundIds = (
    await db.query.rounds.findMany({
      where: { championshipId, published: true },
      columns: { id: true },
    })
  ).map((r) => r.id);

  const allMatches =
    roundIds.length > 0
      ? await db.query.matches.findMany({
          where: { roundId: { in: roundIds }, result: { isNotNull: true } },
          columns: { id: true, nr: true },
          orderBy: { nr: "asc" },
        })
      : [];

  const matchIds = allMatches.map((m) => m.id);

  const allTips =
    matchIds.length > 0
      ? await db
          .select({ matchId: tips.matchId, userId: tips.userId, points: tips.points })
          .from(tips)
          .where(inArray(tips.matchId, matchIds))
      : [];

  const playerInfos: VerlaufPlayer[] = players.map((p) => ({
    userId: p.userId,
    name: p.user?.name ?? "",
  }));

  const cumulative = new Map<number, number>(playerInfos.map((p) => [p.userId, 0]));

  const chartData: ChartPoint[] = allMatches.map((match) => {
    allTips
      .filter((t) => t.matchId === match.id)
      .forEach((t) => {
        cumulative.set(t.userId, (cumulative.get(t.userId) ?? 0) + (t.points ?? 0));
      });

    const sorted = [...playerInfos].sort(
      (a, b) => (cumulative.get(b.userId) ?? 0) - (cumulative.get(a.userId) ?? 0),
    );
    let rank = 1;
    const ranks = new Map<number, number>();
    sorted.forEach((p, i) => {
      if (i > 0 && (cumulative.get(p.userId) ?? 0) < (cumulative.get(sorted[i - 1].userId) ?? 0)) {
        rank = i + 1;
      }
      ranks.set(p.userId, rank);
    });

    const matchPlayers: Record<string, PlayerPoint> = {};
    playerInfos.forEach((p) => {
      matchPlayers[`u${p.userId}`] = {
        points: cumulative.get(p.userId) ?? 0,
        rank: ranks.get(p.userId) ?? 0,
      };
    });

    return { matchNr: match.nr, players: matchPlayers };
  });

  const finalPoint = chartData.at(-1);
  const sortedPlayers = [...playerInfos].sort((a, b) => {
    const pa = finalPoint?.players[`u${a.userId}`]?.points ?? 0;
    const pb = finalPoint?.players[`u${b.userId}`]?.points ?? 0;
    return pb - pa;
  });

  return { players: sortedPlayers, chartData };
}
