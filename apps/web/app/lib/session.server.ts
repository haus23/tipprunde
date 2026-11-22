import { createHash } from "node:crypto";

import { sessions } from "@tipprunde/db/schema";
import { and, eq, lt, ne } from "drizzle-orm";
import { createCookieSessionStorage } from "react-router";

import type { User } from "./context";
import { db } from "./db.server";

const SESSION_DURATION_DEFAULT = Number(process.env["SESSION_DURATION_DEFAULT"]);
const SESSION_DURATION_REMEMBER = Number(process.env["SESSION_DURATION_REMEMBER"]);

const PRUNE_INTERVAL = 24 * 60 * 60 * 1000;
/** In memory, so it resets on every deploy — one extra prune after a release. */
let lastPrune = 0;

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

/**
 * Creates the DB-side session. Returns the id to put into the cookie.
 *
 * The User-Agent is kept raw, only for the player's own session list on
 * /konto; it is parsed when shown. Capped, because the header is whatever the
 * client sends.
 */
export async function createSession(
  userId: number,
  rememberMe: boolean,
  userAgent: string | null,
): Promise<string> {
  const id = generateSessionId();
  const duration = rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION_DEFAULT;
  const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
  await db
    .insert(sessions)
    .values({ id, userId, rememberMe, expiresAt, userAgent: userAgent?.slice(0, 512) ?? null });

  // Piggybacks on login rather than every request: the table only grows when
  // someone signs in, so that is exactly when a sweep of the dead rows is
  // worth considering. There is no judgment call here — expired means
  // expired, always safe to delete — so this needs no admin action to trigger
  // it, unlike revokeUserSessions.
  await pruneExpiredSessions();

  return id;
}

async function pruneExpiredSessions(): Promise<void> {
  const now = Date.now();
  if (now - lastPrune < PRUNE_INTERVAL) return;
  lastPrune = now;

  try {
    await db.delete(sessions).where(lt(sessions.expiresAt, new Date(now).toISOString()));
  } catch (err) {
    // A failed sweep must not break the login it rode in on.
    console.error("[session] prune failed:", err);
  }
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
 *
 * Returns how many rows it removed, so a caller acting on demand (the manual
 * "Sitzungen beenden" button, not the address-change side effect) can tell a
 * real revocation from a click that had nothing to do.
 */
export async function revokeUserSessions(userId: number, keepSessionId?: string): Promise<number> {
  const deleted = await db
    .delete(sessions)
    .where(
      keepSessionId
        ? and(eq(sessions.userId, userId), ne(sessions.id, keepSessionId))
        : eq(sessions.userId, userId),
    )
    .returning({ id: sessions.id });
  return deleted.length;
}

/**
 * Stands in for a session id wherever one would reach the browser. The id is
 * the login itself — the cookie only signs it — so the session list on
 * /konto names each row by a hash of it instead.
 */
function sessionKey(sessionId: string): string {
  return createHash("sha256").update(sessionId).digest("hex").slice(0, 16);
}

/**
 * A user's live sessions, newest first, for their own list on /konto. Each
 * row carries a `key` instead of its id, and `isCurrent` for the one the
 * request came in with.
 */
export async function getUserSessions(userId: number, currentSessionId: string | undefined) {
  const rows = await db.query.sessions.findMany({
    where: { userId, expiresAt: { gt: new Date().toISOString() } },
    columns: { id: true, rememberMe: true, expiresAt: true, createdAt: true, userAgent: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(({ id, createdAt, ...row }) => ({
    ...row,
    key: sessionKey(id),
    isCurrent: id === currentSessionId,
    // SQLite's CURRENT_TIMESTAMP writes "2026-11-22 12:52:06", UTC without
    // saying so — read as is, `new Date()` would take it for local time.
    createdAt: `${createdAt.replace(" ", "T")}Z`,
  }));
}

/**
 * Ends one of a user's own sessions, named by its key. Scoped to the user,
 * so another user's session never matches, and never the current one —
 * that is what logging out is for. Returns whether a row went.
 */
export async function deleteUserSession(
  userId: number,
  key: string,
  currentSessionId: string | undefined,
): Promise<boolean> {
  const rows = await db.query.sessions.findMany({ where: { userId }, columns: { id: true } });
  const target = rows.find((r) => sessionKey(r.id) === key && r.id !== currentSessionId);
  if (!target) return false;
  await db.delete(sessions).where(and(eq(sessions.userId, userId), eq(sessions.id, target.id)));
  return true;
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
