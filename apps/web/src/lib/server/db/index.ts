import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "$env/static/private";
import { relations } from "@tipprunde/db/relations";
import { drizzle } from "drizzle-orm/libsql/web";

export const db = drizzle({
  connection: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
  relations,
});

export * from "@tipprunde/db/schema";
