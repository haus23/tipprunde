import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#db";
import { leagues } from "@/lib/db/schema.ts";

interface LeagueData {
  id: string;
  name: string;
  shortName: string;
}

export const getLeagues = createServerOnlyFn(async () =>
  db.query.leagues.findMany({ orderBy: { name: "asc" } }),
);

export const createLeague = createServerOnlyFn(async (data: LeagueData) =>
  db.insert(leagues).values(data),
);

export const updateLeague = createServerOnlyFn(async (data: LeagueData) => {
  const { id, ...rest } = data;
  return db.update(leagues).set(rest).where(eq(leagues.id, id));
});
