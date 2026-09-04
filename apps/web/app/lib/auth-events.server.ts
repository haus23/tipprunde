import { type AuthEventType, authEvents } from "@tipprunde/db/schema";
import { lt } from "drizzle-orm";

import { db } from "./db.server";

const RETENTION_DAYS = 90;
const PRUNE_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * In memory, so it resets on every deploy — which only means one extra prune
 * after a release. Not worth a table of its own.
 */
let lastPrune = 0;

type AuthEvent = {
  type: AuthEventType;
  userId?: number | null;
  /** The address that was used, including one that matched no user. */
  email?: string | null;
  detail?: string | null;
};

/**
 * Records one authentication event.
 *
 * Never throws: this is a log, and a log that can break the login it observes
 * is worse than no log at all. A failure here goes to stderr and nowhere else.
 */
export async function logAuthEvent({ type, userId, email, detail }: AuthEvent): Promise<void> {
  try {
    await db.insert(authEvents).values({
      type,
      // Written here rather than left to the column default: SQLite's
      // CURRENT_TIMESTAMP writes "2026-09-04 12:52:06", which does not compare
      // correctly against an ISO string. Every read of this table is a
      // comparison — the prune cutoff, the alert window, the newest-first
      // order — so all rows have to be in one format, and that format is the
      // one the rest of the app writes.
      createdAt: new Date().toISOString(),
      userId: userId ?? null,
      email: email ?? null,
      detail: detail ?? null,
    });
    await pruneAuthEvents();
  } catch (err) {
    console.error("[auth-events] insert failed:", err);
  }
}

/**
 * Drops events past the retention window.
 *
 * Piggybacks on writing an event rather than running on a schedule: the table
 * only grows when someone signs in, so the moment a row is added is exactly
 * when a prune is worth considering. The interval keeps that to one DELETE a
 * day instead of one per login.
 */
async function pruneAuthEvents(): Promise<void> {
  const now = Date.now();
  if (now - lastPrune < PRUNE_INTERVAL) return;
  lastPrune = now;

  const cutoff = new Date(now - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();
  await db.delete(authEvents).where(lt(authEvents.createdAt, cutoff));
}
