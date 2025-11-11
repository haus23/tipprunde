import Database from "better-sqlite3";

import { env } from "~/utils/env.server";
import { singleton } from "~/utils/singleton.server";

export const db = singleton("db", () => {
  const db = new Database(env.DATABASE_PATH);
  // Enable foreign key constraints
  db.pragma("foreign_keys = ON");
  return db;
});

// Graceful shutdown handlers
if (typeof window === "undefined" && env.NODE_ENV !== "test") {
  const signals: NodeJS.Signals[] = ["SIGTERM", "SIGINT"];

  for (const signal of signals) {
    process.on(signal, () => {
      console.log(`\nReceived ${signal}, closing database connection...`);
      db.close();
      console.log("Database connection closed");
      process.exit(0);
    });
  }
}
