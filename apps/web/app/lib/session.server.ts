import { sessions } from "@tipprunde/db/schema";
import { and, eq, ne } from "drizzle-orm";
import { createCookieSessionStorage } from "react-router";

import type { User } from "./context";
import { db } from "./db.server";

const SESSION_DURATION_DEFAULT = Number(process.env["SESSION_DURATION_DEFAULT"]);
const SESSION_DURATION_REMEMBER = Number(process.env["SESSION_DURATION_REMEMBER"]);

/**
 * Only ids travel in the cookie; everything else stays in the DB.
 * `pendingEmail` carries the address between the two login steps — it replaces
 * the separate `__pending_auth` cookie the old web app used.
 */
type SessionData = { sessionId: string; pendingEmail: string };

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

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Creates the DB-side session. Returns the id to put into the cookie. */
export async function createSession(userId: number, rememberMe: boolean): Promise<string> {
  const id = generateSessionId();
  const duration = rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION_DEFAULT;
  const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
  await db.insert(sessions).values({ id, userId, rememberMe, expiresAt });
  return id;
}

/** Cookie lifetime mirrors the DB session's — a session cookie unless remembered. */
export function sessionCookieMaxAge(rememberMe: boolean): number | undefined {
  return rememberMe ? SESSION_DURATION_REMEMBER : undefined;
}

/**
 * Ends every session a user holds, optionally sparing one.
 *
 * The address is the only credential — the login code goes there — so changing
 * or clearing it has to cut off whoever held the old one. Without this, a
 * "remember me" session outlives the change by up to 30 days.
 *
 * `keepSessionId` spares the caller's own session, so an admin correcting their
 * own address does not log themselves out mid-edit. Editing someone else, that
 * id belongs to a different user and the clause simply never matches.
 */
export async function revokeUserSessions(userId: number, keepSessionId?: string) {
  await db
    .delete(sessions)
    .where(
      keepSessionId
        ? and(eq(sessions.userId, userId), ne(sessions.id, keepSessionId))
        : eq(sessions.userId, userId),
    );
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
