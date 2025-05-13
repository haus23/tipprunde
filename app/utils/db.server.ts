import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type * as schema from '~/database/schema';

export const db = {} as {
  instance: DrizzleD1Database<typeof schema>;
};

export function initializeDb(instance: DrizzleD1Database<typeof schema>) {
  if (!db.instance) {
    db.instance = instance;
  }
}
