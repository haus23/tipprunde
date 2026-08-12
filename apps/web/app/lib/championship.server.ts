import { db } from "./db.server";

export async function getChampionshipBySlug(slug: string) {
  return db.query.championships.findFirst({ where: { slug } });
}

export async function getLatestChampionship() {
  return db.query.championships.findFirst({ orderBy: { nr: "desc" } });
}

/** The championship the public site shows — latest *published* one. */
export async function getPublishedChampionship() {
  return db.query.championships.findFirst({
    where: { published: true },
    orderBy: { nr: "desc" },
  });
}

export async function getChampionships() {
  return db.query.championships.findMany({
    orderBy: { nr: "desc" },
    columns: { slug: true, name: true },
  });
}

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
