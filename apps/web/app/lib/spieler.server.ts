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
        columns: { id: true, nr: true, date: true, result: true, lowestSumBonus: true },
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

/**
 * A user by slug, independent of any championship — distinguishes "this
 * player never played this season" from "this slug doesn't exist at all"
 * on the Tipps view, which otherwise only sees players who *did* play.
 */
export async function findUserBySlug(slug: string) {
  return db.query.users.findFirst({ where: { slug }, columns: { name: true, slug: true } });
}
