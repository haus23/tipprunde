import { ulid } from "ulidx";
import { db } from "./_db.server";
import type { Session } from "./_types";

export function createSession(userId: number, expiresAt: string) {
  const id = ulid();

  const stmt = db.prepare(`
    INSERT INTO sessions (id, user_id, expires_at)
    VALUES (?, ?, ?)
  `);

  stmt.run(id, userId, expiresAt);

  return id;
}

export function getSession(id: string) {
  const stmt = db.prepare<[string], Session>(
    "SELECT * FROM sessions WHERE id = ?",
  );
  return stmt.get(id) ?? null;
}

export function deleteSession(id: string) {
  const stmt = db.prepare("DELETE FROM sessions WHERE id = ?");
  stmt.run(id);
}

export function deleteExpiredSessions() {
  const stmt = db.prepare(
    "DELETE FROM sessions WHERE expires_at < datetime('now')",
  );
  stmt.run();
}
