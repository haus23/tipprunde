import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class Migrator {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.migrationsDir = path.join(__dirname, "migrations");
    this.init();
  }

  init() {
    // Create migrations tracking table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL UNIQUE,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  run() {
    // Get all migration files
    const files = fs
      .readdirSync(this.migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort(); // Ensures alphabetical order (001-, 002-, etc.)

    // Get applied migrations
    const applied = this.db
      .prepare("SELECT filename FROM _migrations")
      .all()
      .map((row) => row.filename);

    // Find pending migrations
    const pending = files.filter((f) => !applied.includes(f));

    if (pending.length === 0) {
      console.log("✓ Database is up to date");
      return;
    }

    // Apply pending migrations
    console.log(`Found ${pending.length} pending migrations`);

    for (const file of pending) {
      console.log(`Applying ${file}...`);

      const filepath = path.join(this.migrationsDir, file);
      const sql = fs.readFileSync(filepath, "utf8");

      // Run in transaction
      const transaction = this.db.transaction(() => {
        this.db.exec(sql);
        this.db
          .prepare("INSERT INTO _migrations (filename) VALUES (?)")
          .run(file);
      });

      try {
        transaction();
        console.log(`✓ ${file} applied`);
      } catch (error) {
        console.error(`✗ Failed to apply ${file}:`, error.message);
        throw error;
      }
    }

    console.log("✓ All migrations applied");
  }

  // Utility: Reset database (development only)
  reset() {
    if (process.env.NODE_ENV === "production") {
      console.error("Cannot reset database in production!");
      process.exit(1);
    }

    console.log("Resetting database...");

    // Get all tables except sqlite internals
    const tables = this.db
      .prepare(
        `
        SELECT name FROM sqlite_master
        WHERE type='table'
        AND name NOT LIKE 'sqlite_%'
      `,
      )
      .all();

    // Drop all tables
    for (const { name } of tables) {
      this.db.exec(`DROP TABLE IF EXISTS "${name}"`);
      console.log(`Dropped table: ${name}`);
    }

    // Re-run migrations
    this.init();
    this.run();
  }

  close() {
    this.db.close();
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2];
  const dbPath = process.env.DATABASE_PATH || path.join(__dirname, "dev.db");

  const migrator = new Migrator(dbPath);

  try {
    switch (command) {
      case "up":
        migrator.run();
        break;
      case "reset":
        migrator.reset();
        break;
      default:
        console.log("Usage: node migrate.js [up|reset]");
        console.log("  up    - Run pending migrations");
        console.log(
          "  reset - Drop all tables and re-run migrations (dev only)",
        );
    }
  } finally {
    migrator.close();
  }
}
