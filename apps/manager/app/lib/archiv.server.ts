import { db } from "./db.server";

/** Groups winner rows by championship — several players can share rank 1. */
function groupWinners<T extends { championshipId: number }>(rows: T[]) {
  const byChampionship = new Map<number, T[]>();
  for (const row of rows) {
    const list = byChampionship.get(row.championshipId) ?? [];
    list.push(row);
    byChampionship.set(row.championshipId, list);
  }
  return byChampionship;
}

/** The three most recent completed championships, excluding the current one. */
export async function getArchivPreview(currentChampionshipId: number) {
  const recentCompleted = await db.query.championships.findMany({
    where: { completed: true },
    orderBy: { nr: "desc" },
    limit: 4,
    columns: { id: true, slug: true, name: true },
  });

  const filtered = recentCompleted.filter((c) => c.id !== currentChampionshipId).slice(0, 3);
  if (filtered.length === 0) return [];

  const winners = await db.query.players.findMany({
    where: { rank: 1, championshipId: { in: filtered.map((c) => c.id) } },
    columns: { championshipId: true, total: true },
    with: { user: { columns: { name: true, slug: true } } },
  });

  const winnersByChampionship = groupWinners(winners);

  return filtered.map((c) => ({
    slug: c.slug,
    name: c.name,
    winners: (winnersByChampionship.get(c.id) ?? []).map((w) => ({
      name: w.user.name,
      slug: w.user.slug,
      total: w.total ?? 0,
    })),
  }));
}

export type ArchivEntry = Awaited<ReturnType<typeof getArchivPreview>>[number];
