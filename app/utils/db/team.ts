import type { TeamInsert } from '~/database/types';

import { asc } from 'drizzle-orm';

import app from '~/app';
import { teams } from '~/database/schema';

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

export async function getTeams() {
  const { db } = app;
  return db.query.teams.findMany({ orderBy: [asc(teams.shortname)] });
}

export async function getTeamsCount() {
  const { db } = app;
  return db.$count(teams);
}
