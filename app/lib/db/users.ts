import type { InsertableUser, UpdatableUser, User } from "../model/user";
import { db } from "./_db.server";

export function getUserById(id: number) {
  const stmt = db.prepare<[number], User>("SELECT * FROM users WHERE id = ?");
  return stmt.get(id) ?? null;
}

export function getUserByEmail(email: string) {
  const stmt = db.prepare<[string], User>(
    "SELECT * FROM users WHERE email = ?",
  );
  return stmt.get(email) ?? null;
}

export function getUserBySlug(slug: string) {
  const stmt = db.prepare<[string], User>(
    "SELECT * FROM users WHERE slug = ?",
  );
  return stmt.get(slug) ?? null;
}

export function getUsers() {
  const stmt = db.prepare<[], User>("SELECT * FROM users WHERE id != 0 ORDER BY name");
  return stmt.all();
}

export function createUser({
  name,
  slug,
  email = null,
  role = "USER",
}: InsertableUser) {
  const stmt = db.prepare(`
    INSERT INTO users (name, slug, email, role)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(name, slug, email, role);
}

export function updateUser({
  id,
  name,
  slug,
  email = null,
  role = "USER",
}: UpdatableUser) {
  const stmt = db.prepare(`
    UPDATE users
    SET name = ?, slug = ?, email = ?, role = ?
    WHERE id = ?
  `);

  stmt.run(name, slug, email, role, id);
}
