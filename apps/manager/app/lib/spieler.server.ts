import { db } from "./db.server";

/** Published rounds with one player's tips, plus their round bonus per round. */
export async function getPlayerMatches(championshipId: number, userId: number) {
  return db.query.rounds.findMany({
    where: { championshipId, published: true },
    orderBy: { nr: "asc" },
    columns: { id: true, nr: true, tipsPublished: true },
    with: {
      roundPoints: {
        where: { userId },
        columns: { points: true },
      },
      matches: {
        orderBy: { nr: "asc" },
        columns: { id: true, nr: true, date: true, result: true },
        with: {
          hometeam: { columns: { name: true, shortName: true } },
          awayteam: { columns: { name: true, shortName: true } },
          // Only this player's tip — points/joker are already persisted.
          tips: {
            where: { userId },
            columns: { tip: true, points: true, joker: true, extraJoker: true },
          },
        },
      },
    },
  });
}

export type PlayerRound = Awaited<ReturnType<typeof getPlayerMatches>>[number];
export type PlayerMatch = PlayerRound["matches"][number];

/** The championship's ruleset — the public views only need its rule ids. */
export async function getRuleset(championshipId: number) {
  const championship = await db.query.championships.findFirst({
    where: { id: championshipId },
    columns: { id: true },
    with: { ruleset: true },
  });
  return championship?.ruleset ?? null;
}

export type Ruleset = NonNullable<Awaited<ReturnType<typeof getRuleset>>>;
