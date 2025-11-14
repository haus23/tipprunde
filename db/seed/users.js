export function seedUsers(db) {
  // Check if root user already exists
  const existingRoot = db.prepare("SELECT id FROM users WHERE id = 0").get();

  if (existingRoot) {
    console.log("✓ Root user already exists, skipping");
    return;
  }

  if (!process.env.ROOT_EMAIL) {
    throw new Error("ROOT_EMAIL environment variable is required");
  }

  // Insert root user
  const insert = db.prepare(`
    INSERT INTO users (id, name, slug, email, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run(0, "Root", "root", process.env.ROOT_EMAIL, "ADMIN");

  console.log("✓ Root user created successfully");
  console.log(`  Email: ${process.env.ROOT_EMAIL}`);
}
