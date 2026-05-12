import { TURSO_DATABASE_URL, TURSO_AUTH_TOKEN } from "$env/static/private";
import { drizzle } from "drizzle-orm/libsql/web";

import { relations } from "./relations";

export const db = drizzle({
  connection: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  },
  relations,
});
