import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { championships, players, users } from "@tipprunde/db/schema";
import { count, eq, sum } from "drizzle-orm";

import { db } from "#/lib/db.server.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";

const getArchivPreview = createServerFn()
  .validator((currentChampionshipId: number) => currentChampionshipId)
  .handler(async ({ data: currentChampionshipId }) => {
    const recentCompleted = await db.query.championships.findMany({
      where: { completed: true },
      orderBy: { nr: "desc" },
      limit: 4,
      columns: { id: true, slug: true, name: true },
    });

    const filtered = recentCompleted.filter((c) => c.id !== currentChampionshipId).slice(0, 3);

    if (filtered.length === 0) return { championships: [] };

    const ids = filtered.map((c) => c.id);
    const winners = await db.query.players.findMany({
      where: { rank: 1, championshipId: { in: ids } },
      columns: { championshipId: true, total: true },
      with: { user: { columns: { name: true, slug: true } } },
    });

    const winnersByChampionship = new Map<number, typeof winners>();
    for (const w of winners) {
      const list = winnersByChampionship.get(w.championshipId) ?? [];
      list.push(w);
      winnersByChampionship.set(w.championshipId, list);
    }

    return {
      championships: filtered.map((c) => ({
        slug: c.slug,
        name: c.name,
        winners: (winnersByChampionship.get(c.id) ?? []).map((w) => ({
          name: w.user.name,
          slug: w.user.slug,
          total: w.total ?? 0,
        })),
      })),
    };
  });

export type ArchivEntry = Awaited<ReturnType<typeof getArchivPreview>>["championships"][number];

export const archivPreviewQueryOptions = (currentChampionshipId: number) =>
  queryOptions({
    queryKey: ["archiv-preview", currentChampionshipId],
    queryFn: () => getArchivPreview({ data: currentChampionshipId }),
  });

const getAllCompletedChampionships = createServerFn().handler(async () => {
  const allCompleted = await db.query.championships.findMany({
    where: { completed: true },
    orderBy: { nr: "desc" },
    columns: { id: true, slug: true, name: true },
  });

  if (allCompleted.length === 0) return { championships: [] };

  const ids = allCompleted.map((c) => c.id);
  const winners = await db.query.players.findMany({
    where: { rank: 1, championshipId: { in: ids } },
    columns: { championshipId: true, total: true },
    with: { user: { columns: { name: true } } },
  });

  const winnersByChampionship = new Map<number, typeof winners>();
  for (const w of winners) {
    const list = winnersByChampionship.get(w.championshipId) ?? [];
    list.push(w);
    winnersByChampionship.set(w.championshipId, list);
  }

  return {
    championships: allCompleted.map((c) => ({
      slug: c.slug,
      name: c.name,
      winners: (winnersByChampionship.get(c.id) ?? []).map((w) => ({
        name: w.user.name,
        total: w.total ?? 0,
      })),
    })),
  };
});

export const allCompletedChampionshipsQueryOptions = queryOptions({
  queryKey: ["archiv-all-championships"],
  queryFn: () => getAllCompletedChampionships(),
});

const getEwigeTabelle = createServerFn().handler(async () => {
  const rows = await db
    .select({
      userId: players.userId,
      name: users.name,
      totalPoints: sum(players.total),
      played: count(),
    })
    .from(players)
    .innerJoin(championships, eq(players.championshipId, championships.id))
    .innerJoin(users, eq(players.userId, users.id))
    .where(eq(championships.completed, true))
    .groupBy(players.userId);

  const sorted = rows
    .map((r) => ({
      userId: r.userId,
      name: r.name,
      totalPoints: Number(r.totalPoints ?? 0),
      played: r.played,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints || a.name.localeCompare(b.name, "de"));

  let rank = 1;
  const ranked = sorted.map((entry, i) => {
    if (i > 0 && sorted[i - 1].totalPoints !== entry.totalPoints) rank = i + 1;
    return { ...entry, rank };
  });

  return { entries: ranked };
});

export const ewigeTabellQueryOptions = queryOptions({
  queryKey: ["ewige-tabelle"],
  queryFn: () => getEwigeTabelle(),
});

// Combined single-RPC fetch used by the archiv.$slug route: fetches championship
// info and its ranking in one server round-trip instead of two sequential calls.
const getArchivChampionship = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const championship = await db.query.championships.findFirst({
      where: { slug, completed: true },
      columns: { id: true, slug: true, name: true, extraQuestionPointsPublished: true },
    });
    if (!championship) return { championship: null, ranking: [] as RankedPlayer[] };

    const playerRows = await db.query.players.findMany({
      where: { championshipId: championship.id },
      columns: {
        userId: true,
        rank: true,
        tipPoints: true,
        extraQuestionPoints: true,
        roundPoints: true,
        total: true,
      },
      with: { user: { columns: { name: true, slug: true } } },
    });

    const ranking: RankedPlayer[] = playerRows
      .filter((p) => p.rank !== null)
      .map((p) => ({
        userId: p.userId,
        name: p.user?.name ?? "",
        slug: p.user?.slug ?? "",
        tipPoints: p.tipPoints ?? 0,
        extraQuestionPoints: p.extraQuestionPoints ?? 0,
        roundPoints: p.roundPoints ?? null,
        total: p.total ?? 0,
        rank: p.rank!,
      }))
      .sort((a, b) => a.rank - b.rank);

    return { championship, ranking };
  });

export const archivChampionshipQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["archiv-championship-data", slug],
    queryFn: () => getArchivChampionship({ data: slug }),
  });
