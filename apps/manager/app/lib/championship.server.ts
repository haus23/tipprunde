import { db } from "./db.server";

export async function getChampionshipBySlug(slug: string) {
  return db.query.championships.findFirst({ where: { slug } });
}

export async function getLatestChampionship() {
  return db.query.championships.findFirst({ orderBy: { nr: "desc" } });
}
