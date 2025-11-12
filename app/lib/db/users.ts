import { db } from "./_db.server";
import type { User } from "./_types";

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
