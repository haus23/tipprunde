import path from "node:path";
import { fileURLToPath } from "node:url";
import Database from "better-sqlite3";
import { seedUsers } from "./users.js";
import { seedRules } from "./rules.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "..", "dev.db");

  console.log(`Seeding database: ${dbPath}`);

  const db = new Database(dbPath);

  try {
    seedUsers(db);
    seedRules(db);

    console.log("\n✓ All seeds completed");
  } catch (error) {
    console.error("Seed failed:", error.message);
    throw error;
  } finally {
    db.close();
  }
}
