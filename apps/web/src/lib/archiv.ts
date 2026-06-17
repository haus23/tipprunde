import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { db } from "#/lib/db.server.ts";

export const getChampionshipBySlug = createServerFn()
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const championship = await db.query.championships.findFirst({
      where: { slug, completed: true },
      columns: { id: true, slug: true, name: true, extraQuestionPointsPublished: true },
    });
    return { championship: championship ?? null };
  });

export const championshipBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["archiv-championship", slug],
    queryFn: () => getChampionshipBySlug({ data: slug }),
  });

export const getArchivPreview = createServerFn()
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
