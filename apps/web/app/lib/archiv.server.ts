import { championships, players, users } from "@tipprunde/db/schema";
import { count, eq, sum } from "drizzle-orm";

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

/**
 * Every published championship — the archiv index list. Completed ones carry
 * their winner(s); the still-running one (if any) has none yet, since `rank`
 * is live-updated all season and would otherwise read as a false "winner".
 */
export async function getArchivChampionshipList() {
  const all = await db.query.championships.findMany({
    where: { published: true },
    orderBy: { nr: "desc" },
    columns: { id: true, slug: true, name: true, completed: true },
  });
  if (all.length === 0) return [];

  const completedIds = all.filter((c) => c.completed).map((c) => c.id);
  const winners = completedIds.length
    ? await db.query.players.findMany({
        where: { rank: 1, championshipId: { in: completedIds } },
        columns: { championshipId: true, total: true },
        with: { user: { columns: { name: true, slug: true } } },
      })
    : [];

  const winnersByChampionship = groupWinners(winners);

  return all.map((c) => ({
    slug: c.slug,
    name: c.name,
    completed: c.completed,
    winners: (winnersByChampionship.get(c.id) ?? []).map((w) => ({
      name: w.user.name,
      slug: w.user.slug,
      total: w.total ?? 0,
    })),
  }));
}

/**
 * All-time standings across every published championship, including the
 * still-running one — its provisional totals count already, same as any
 * "ewige Tabelle" that updates through the current season rather than only
 * after it ends.
 */
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
    .where(eq(championships.published, true))
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
 * A championship by slug, resolved once by the Archiv's layout route and
 * shared with its child routes via context — same pattern as
 * `_championship-layout.tsx`.
 *
 * `published`, not `completed`: visibility and "finished" are orthogonal
 * (see docs/decisions/05-championship-scope.md). The running championship is
 * reachable this way too — a harmless coincidence, not a special case to
 * guard against.
 */
export async function getArchivChampionshipBySlug(slug: string) {
  return (await db.query.championships.findFirst({ where: { slug, published: true } })) ?? null;
}

/**
 * Nearest lower/higher published championship by nr — null at the ends.
 *
 * `published`, not `completed` — same visibility rule as
 * `getArchivChampionshipBySlug`. Filtering on `completed` here would break
 * the chain asymmetrically: the still-running championship stays reachable
 * by slug (published), so Prev could step off of it, but Next could never
 * step back onto it.
 */
export async function getAdjacentArchivChampionships(nr: number) {
  const [prev, next] = await Promise.all([
    db.query.championships.findFirst({
      where: { nr: { lt: nr }, published: true },
      orderBy: { nr: "desc" },
      columns: { slug: true, name: true },
    }),
    db.query.championships.findFirst({
      where: { nr: { gt: nr }, published: true },
      orderBy: { nr: "asc" },
      columns: { slug: true, name: true },
    }),
  ]);

  return { prev: prev ?? null, next: next ?? null };
}
