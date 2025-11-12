import { db } from "./_db.server";
import type { User } from "./_types";

export function getUserByEmail(email: string) {
  const stmt = db.prepare<[string], User>(
    "SELECT * FROM users WHERE email = ?",
  );
  return stmt.get(email) ?? null;
}
