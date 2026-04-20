import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "#db";

import { leagues } from "../schema/tables.ts";

export type League = typeof leagues.$inferSelect;

export const getLeagues = createServerOnlyFn(async () =>
  db.query.leagues.findMany({ orderBy: { name: "asc" } }),
);

export const createLeague = createServerOnlyFn(async (data: typeof leagues.$inferInsert) =>
  db.insert(leagues).values(data),
);

export const updateLeague = createServerOnlyFn(async (data: typeof leagues.$inferInsert) => {
  const { id, ...rest } = data;
  return db.update(leagues).set(rest).where(eq(leagues.id, id));
});
