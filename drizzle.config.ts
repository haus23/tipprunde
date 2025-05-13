import type { Config } from 'drizzle-kit';

export default {
  out: './migrations',
  dialect: 'sqlite',
  schema: './database/schema.ts',
  casing: 'snake_case',
  driver: 'd1-http',
  dbCredentials: {
    databaseId: '2bafeb39-eb95-43ce-88d0-c307c3200587',
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    token: process.env.CLOUDFLARE_TOKEN!,
  },
} satisfies Config;
