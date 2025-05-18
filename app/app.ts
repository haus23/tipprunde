import type { DrizzleD1Database } from 'drizzle-orm/d1';

import { drizzle } from 'drizzle-orm/d1';

import * as schema from '~/database/schema';

type App = {
  db: DrizzleD1Database<typeof schema>;
  kvLegacySync: KVNamespace;
};

const appInstance = {} as App;

const app = {
  get db() {
    if (!appInstance.db) {
      throw new Error('Drizzle not initialized');
    }
    return appInstance.db;
  },

  get kvLegacySync() {
    if (!appInstance.kvLegacySync) {
      throw new Error('KV Namespace LegacySync not initialized');
    }
    return appInstance.kvLegacySync;
  },
} satisfies App;

export function initializeApp(cloudflareEnv: Env): App {
  appInstance.db = drizzle(cloudflareEnv.DB, {
    schema,
    casing: 'snake_case',
  });
  appInstance.kvLegacySync = cloudflareEnv.LEGACY_SYNC;

  return app;
}

export default app;
