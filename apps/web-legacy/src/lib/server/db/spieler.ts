import { db } from ".";

export async function getSpieler(championshipId: number, userId: number) {
  return db.query.rounds.findMany({
    where: { championshipId, published: true },
    orderBy: { nr: "asc" },
    with: {
      matches: {
        orderBy: { nr: "asc" },
        with: {
          hometeam: true,
          awayteam: true,
          tips: { where: { userId } },
        },
      },
    },
  });
}
