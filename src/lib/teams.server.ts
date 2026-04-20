import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#db";
import { teams } from "#db/schema/tables.ts";

interface TeamData {
  id: string;
  name: string;
  shortName: string;
}

export const getTeams = createServerOnlyFn(async () =>
  db.query.teams.findMany({ orderBy: { name: "asc" } }),
);

export const createTeam = createServerOnlyFn(async (data: TeamData) =>
  db.insert(teams).values(data),
);

export const updateTeam = createServerOnlyFn(async (data: TeamData) => {
  const { id, ...rest } = data;
  return db.update(teams).set(rest).where(eq(teams.id, id));
});
