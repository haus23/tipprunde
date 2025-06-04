import type { TeamInsert } from '~/database/types';

import { asc, eq } from 'drizzle-orm';

import app from '~/app';
import { teams } from '~/database/schema';

/**
 * Creates a new team.
 *
 * @param team - The team data to insert. Must conform to the structure defined by `teams.$inferInsert`.
 * @return A promise that resolves when the operation is completed.
 */
export async function createTeam(team: TeamInsert) {
  const { db } = app;
  return db.insert(teams).values(team);
}

/**
 * Updates a team's information in the database.
 *
 * @param id - The team id - primary key
 * @param team - The team object containing updated information. The `id` property is used to locate the team in the database.
 * @return A promise that resolves to the result of the database update operation.
 */
export async function updateTeam(id: number, team: TeamInsert) {
  const { db } = app;
  return db.update(teams).set(team).where(eq(teams.id, id));
}

/**
 * Creates a new team or updates an existing team based on the provided data.
 * If a conflict occurs on the `slug` field, the existing record will be updated with the new data.
 * This method is mainly used for syncing the legacy teams
 *
 * @param props - The team data to insert or update. Must conform to the structure defined by `teams.$inferInsert`.
 * @return A promise that resolves when the operation is completed.
 */
export async function createOrUpdateLegacyTeam(props: TeamInsert) {
  const { db } = app;
  return db.insert(teams).values(props).onConflictDoUpdate({
    target: teams.slug,
    set: props,
  });
}

/**
 * Get all teams sorted by shortname
 *
 * @returns Promise resolving to an array of sorted teams
 */
export async function getTeams() {
  const { db } = app;
  return db.query.teams.findMany({ orderBy: [asc(teams.shortname)] });
}

/**
 * Gets team count
 *
 * @returns Promise resolving to the count of teams
 */
export async function getTeamsCount() {
  const { db } = app;
  return db.$count(teams);
}
