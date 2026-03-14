import { createServerOnlyFn } from "@tanstack/react-start";
import { db } from "@/lib/db";

export const getChampionships = createServerOnlyFn(async () =>
  db.query.championships.findMany({ orderBy: { nr: "desc" } }),
);

export const getChampionshipBySlug = createServerOnlyFn(async (slug: string) =>
  db.query.championships.findFirst({ where: { slug } }),
);

export const getLatestChampionship = createServerOnlyFn(async () =>
  db.query.championships.findFirst({ orderBy: { nr: "desc" } }),
);
