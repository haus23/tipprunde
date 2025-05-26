import type { Config } from 'drizzle-kit';

import * as v from 'valibot';

const localEnvSchema = v.object({
  CLOUDFLARE_ACCOUNT_ID: v.string(),
  CLOUDFLARE_TOKEN: v.string(),
});

const env = v.parse(localEnvSchema, process.env);

export default {
  out: './migrations',
  dialect: 'sqlite',
  schema: './database/schema.ts',
  casing: 'snake_case',
  driver: 'd1-http',
  dbCredentials: {
    databaseId: '2bafeb39-eb95-43ce-88d0-c307c3200587',
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
    token: env.CLOUDFLARE_TOKEN,
  },
} satisfies Config;
