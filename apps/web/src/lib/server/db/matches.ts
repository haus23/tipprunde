import { db } from ".";

export async function getCurrentMatches(championshipId: number) {
  const datedMatches = await db.query.matches.findMany({
    where: {
      round: {
        championshipId,
        published: true,
      },
      date: { isNotNull: true },
    },
    orderBy: { date: "asc" },
    with: { hometeam: true, awayteam: true },
  });

  const withResult = datedMatches.filter((m) => m.result !== null);
  const withoutResult = datedMatches.filter((m) => m.result === null);
  const openCount = Math.min(withoutResult.length, 4 - Math.min(withResult.length, 2));
  const closedCount = Math.min(withResult.length, 4 - openCount);
  const currentMatches = [
    ...withResult.slice(withResult.length - closedCount),
    ...withoutResult.slice(0, openCount),
  ].sort((a, b) => a.date!.localeCompare(b.date!));

  return currentMatches;
}

export async function getRoundsWithMatches(championshipId: number) {
  return db.query.rounds.findMany({
    where: { championshipId, published: true },
    orderBy: { nr: "asc" },
    with: {
      matches: {
        orderBy: { nr: "asc" },
        with: {
          league: true,
          hometeam: true,
          awayteam: true,
          tips: true,
        },
      },
    },
  });
}
