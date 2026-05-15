import { eq, sum } from "drizzle-orm";

import { db, tips, matches, rounds } from ".";

export async function getRanking(championshipId: number) {
  const players = await db.query.players.findMany({
    where: { championshipId },
    with: { user: true },
    orderBy: { id: "asc" },
  });

  const playersTips = await db
    .select({ userId: tips.userId, points: sum(tips.points) })
    .from(tips)
    .innerJoin(matches, eq(tips.matchId, matches.id))
    .innerJoin(rounds, eq(matches.roundId, rounds.id))
    .where(eq(rounds.championshipId, championshipId))
    .groupBy(tips.userId);

  const playersPoints = players.map((p) => ({
    userId: p.userId,
    name: p.user?.name,
    slug: p.user?.slug,
    points: Number(playersTips.find((r) => r.userId === p.userId)?.points ?? 0),
  }));

  const ranking = playersPoints
    .toSorted((a, b) => b.points - a.points)
    .reduce<((typeof playersPoints)[number] & { rank: number })[]>((acc, player, index) => {
      const prev = acc.at(-1);
      const rank = prev && prev.points === player.points ? prev.rank : index + 1;
      return [...acc, { ...player, rank }];
    }, []);

  return ranking;
}
