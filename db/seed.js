import path from "node:path";
import { fileURLToPath } from "node:url";

import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const dbPath = process.env.DATABASE_URL || path.join(__dirname, "dev.db");

  if (!process.env.ROOT_EMAIL) {
    console.error("Error: ROOT_EMAIL environment variable is required");
    process.exit(1);
  }

  console.log(`Seeding database: ${dbPath}`);

  const db = new Database(dbPath);

  try {
    // Check if root user already exists
    const existingRoot = db.prepare("SELECT id FROM users WHERE id = 0").get();

    if (existingRoot) {
      console.log("✓ Root user already exists, skipping seed");
      process.exit(0);
    }

    // Insert root user
    const insert = db.prepare(`
      INSERT INTO users (id, name, slug, email, role)
      VALUES (?, ?, ?, ?, ?)
    `);

    insert.run(0, "Root", "root", process.env.ROOT_EMAIL, "ADMIN");

    console.log("✓ Root user created successfully");
    console.log(`  Email: ${process.env.ROOT_EMAIL}`);
  } catch (error) {
    console.error("Seed failed:", error.message);
    throw error;
  } finally {
    db.close();
  }
}
