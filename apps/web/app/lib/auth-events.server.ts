import { type AuthEventType, authEvents } from "@tipprunde/db/schema";
import { lt } from "drizzle-orm";

import { db } from "./db.server";
import { opsMail, sendMail } from "./mail.server";

const ALERT_EMAIL = process.env["ALERT_EMAIL"];

const RETENTION_DAYS = 90;
const PRUNE_INTERVAL = 24 * 60 * 60 * 1000;

/**
 * More than five failed attempts within ten minutes is the point where this
 * stops looking like someone mistyping their address. Set from the shape of
 * this site, not from a standard: a round has around twenty players, and a
 * legitimate person fails twice and then asks Micha.
 */
const ALERT_THRESHOLD = 5;
const ALERT_WINDOW = 10 * 60 * 1000;
/** Silence after an alert. An attack that keeps running is still one attack. */
const ALERT_COOLDOWN = 60 * 60 * 1000;

/**
 * What counts as a failed attempt. An expired code does not: it means someone
 * asked for one and got to it too late, which is nobody attacking anything.
 * A technical failure does not either — that is a fault, not an attempt.
 */
const FAILURE_TYPES: AuthEventType[] = ["unknown_email", "code_invalid", "code_max_attempts"];

let lastAlert = 0;

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

  // Separate, so a mail that will not go out cannot be mistaken for a log that
  // did not get written.
  if (FAILURE_TYPES.includes(type)) {
    try {
      await checkForAttack();
    } catch (err) {
      console.error("[auth-events] alert failed:", err);
    }
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

/**
 * Mails when failed attempts pile up.
 *
 * Counted across the whole site rather than per address: without IP addresses
 * the address is the only handle there is, and someone working through a list
 * of guesses would stay under a per-address threshold forever. With this few
 * users, six failures inside ten minutes is unusual whoever they belong to.
 */
async function checkForAttack(): Promise<void> {
  const now = Date.now();
  if (now - lastAlert < ALERT_COOLDOWN) return;

  const since = new Date(now - ALERT_WINDOW).toISOString();
  const recent = await db.query.authEvents.findMany({
    where: { type: { in: FAILURE_TYPES }, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });

  if (recent.length <= ALERT_THRESHOLD) return;
  lastAlert = now;

  if (!ALERT_EMAIL) {
    console.warn(`[auth-events] ${recent.length} failed attempts, but ALERT_EMAIL is not set.`);
    return;
  }

  const labels: Record<string, string> = {
    unknown_email: "unbekannte Adresse",
    code_invalid: "falscher Code",
    code_max_attempts: "zu viele Fehlversuche",
  };

  const body = [
    `${recent.length} fehlgeschlagene Anmeldeversuche in den letzten ${ALERT_WINDOW / 60000} Minuten.`,
    "",
    ...recent.map((event) => {
      const time = new Date(event.createdAt).toLocaleTimeString("de-DE", {
        timeZone: "Europe/Berlin",
      });
      return `${time}  ${labels[event.type] ?? event.type}  ${event.email ?? "—"}`;
    }),
    "",
    "Alle Ereignisse im Manager unter /manager/sicherheit.",
  ].join("\n");

  await sendMail({
    to: ALERT_EMAIL,
    subject: `[runde.tips] ${recent.length} fehlgeschlagene Anmeldeversuche`,
    ...opsMail(body),
  });
}

/**
 * The security overview's data. Capped rather than paged: the point of the
 * page is "what happened lately", and a window that reaches back further than
 * anyone scrolls is not worth a pagination control.
 */
export async function getAuthEvents(limit = 200) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [events, lastDay, total] = await Promise.all([
    db.query.authEvents.findMany({
      orderBy: { createdAt: "desc" },
      limit,
      with: { user: { columns: { name: true } } },
    }),
    db.query.authEvents.findMany({
      where: { createdAt: { gte: since } },
      columns: { type: true },
    }),
    db.$count(authEvents),
  ]);

  return {
    events,
    total,
    limit,
    logins: lastDay.filter((e) => e.type === "login_succeeded").length,
    failures: lastDay.filter((e) => FAILURE_TYPES.includes(e.type)).length,
    retentionDays: RETENTION_DAYS,
  };
}
