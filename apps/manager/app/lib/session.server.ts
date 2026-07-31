import { sessions } from "@tipprunde/db/schema";
import { eq } from "drizzle-orm";
import { createCookieSessionStorage } from "react-router";

import type { User } from "./context";
import { db } from "./db.server";

/** Only the session id travels in the cookie; everything else stays in the DB. */
type SessionData = { sessionId: string };

const storage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__auth",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    secrets: [process.env.SESSION_SECRET!],
  },
});

export const { getSession, commitSession, destroySession } = storage;

export function getSessionFromRequest(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

/**
 * Resolves the logged-in user, or null. Deliberately does *not* enforce a role —
 * public routes serve anonymous visitors, and the manager layout does its own
 * role check on top of this.
 */
export async function getSessionUser(request: Request): Promise<User | null> {
  const session = await getSessionFromRequest(request);
  const sessionId = session.get("sessionId");
  if (!sessionId) return null;

  const row = await db.query.sessions.findFirst({
    where: { id: sessionId },
    with: { user: { columns: { id: true, name: true, slug: true, role: true } } },
  });

  if (!row || !row.user || row.expiresAt < new Date().toISOString()) return null;

  return row.user;
}

export function isManager(user: User | null): boolean {
  return user?.role === "manager" || user?.role === "admin";
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
