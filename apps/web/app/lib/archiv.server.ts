import { championships, players, users } from "@tipprunde/db/schema";
import { count, eq, sum } from "drizzle-orm";

import { db } from "./db.server";
import type { RankedPlayer } from "./ranking.server";

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

/** Every completed championship with its winner(s) — the archiv index list. */
export async function getAllCompletedChampionships() {
  const allCompleted = await db.query.championships.findMany({
    where: { completed: true },
    orderBy: { nr: "desc" },
    columns: { id: true, slug: true, name: true },
  });
  if (allCompleted.length === 0) return [];

  const winners = await db.query.players.findMany({
    where: { rank: 1, championshipId: { in: allCompleted.map((c) => c.id) } },
    columns: { championshipId: true, total: true },
    with: { user: { columns: { name: true, slug: true } } },
  });

  const winnersByChampionship = groupWinners(winners);

  return allCompleted.map((c) => ({
    slug: c.slug,
    name: c.name,
    winners: (winnersByChampionship.get(c.id) ?? []).map((w) => ({
      name: w.user.name,
      slug: w.user.slug,
      total: w.total ?? 0,
    })),
  }));
}

/** All-time standings across completed championships. */
export async function getEwigeTabelle() {
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

  // Equal point totals share a rank; the next distinct total skips ahead.
  let rank = 1;
  return sorted.map((entry, i) => {
    if (i > 0 && sorted[i - 1].totalPoints !== entry.totalPoints) rank = i + 1;
    return { ...entry, rank };
  });
}

/**
 * One completed championship by slug — resolved once by the Archiv's layout
 * route and shared with its child routes (tabelle, regelwerk) via context,
 * the same pattern as `_championship-layout.tsx`.
 */
export async function getArchivChampionshipBySlug(slug: string) {
  return (await db.query.championships.findFirst({ where: { slug, completed: true } })) ?? null;
}

/** A completed championship's final ranking. */
export async function getArchivRanking(championshipId: number): Promise<RankedPlayer[]> {
  const playerRows = await db.query.players.findMany({
    where: { championshipId },
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

  return playerRows
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
}
