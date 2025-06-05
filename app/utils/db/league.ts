import app from '~/app';
import { leagues } from '~/database/schema';

/**
 * Gets league count
 *
 * @returns Promise resolving to the count of leagues
 */
export async function getLeaguesCount() {
  const { db } = app;
  return db.$count(leagues);
}
