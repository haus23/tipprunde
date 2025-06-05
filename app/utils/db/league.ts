import type { LeagueInsert } from '~/database/types';

import app from '~/app';
import { leagues } from '~/database/schema';

/**
 * Creates a new league or updates an existing league based on the provided data.
 * If a conflict occurs at the `slug` field, the existing record will be updated with the new data.
 * This method is mainly used for syncing the legacy leagues
 *
 * @param props - The league data to insert or update. Must conform to the structure defined by `leagues.$inferInsert`.
 * @return A promise that resolves when the operation is completed.
 */
export async function createOrUpdateLegacyLeague(props: LeagueInsert) {
  const { db } = app;
  return db.insert(leagues).values(props).onConflictDoUpdate({
    target: leagues.slug,
    set: props,
  });
}

/**
 * Gets league count
 *
 * @returns Promise resolving to the count of leagues
 */
export async function getLeaguesCount() {
  const { db } = app;
  return db.$count(leagues);
}
