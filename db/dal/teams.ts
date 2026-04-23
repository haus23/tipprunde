import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";

import { db } from "#db";

import { teams } from "../schema/tables.ts";

export type Team = typeof teams.$inferSelect;

export const getTeams = createServerOnlyFn(async () =>
  db.query.teams.findMany({ orderBy: { shortName: "asc" } }),
);

export const createTeam = createServerOnlyFn(async (data: typeof teams.$inferInsert) =>
  db.insert(teams).values(data),
);

export const updateTeam = createServerOnlyFn(async (data: typeof teams.$inferInsert) => {
  const { id, ...rest } = data;
  return db.update(teams).set(rest).where(eq(teams.id, id));
});
