import { isRouteErrorResponse } from "react-router";

import { opsMail, sendMail } from "./mail.server.ts";

/**
 * Mails unhandled server errors to whoever runs the site.
 *
 * Imported from `server/app.ts`, which Node runs directly with type stripping
 * — so this file and everything it reaches must stay free of JSX, `import.meta.env`
 * and anything else only Vite understands. Relative imports need their file
 * extension here for the same reason — Node's resolver does not guess it, and
 * the rest of `lib/` gets away without one only because Vite resolves it.
 *
 * Until now nobody found out about a server error unless a user mentioned it.
 * The error page says "Bitte versuche es später noch einmal", which asks for
 * patience and offers no way to report anything.
 */

const ALERT_EMAIL = process.env["ALERT_EMAIL"];

/** One mail per distinct error per hour, and never more than ten in an hour. */
const COOLDOWN = 60 * 60 * 1000;
const MAX_PER_HOUR = 10;

const lastSent = new Map<string, number>();
let windowStart = 0;
let sentInWindow = 0;

/**
 * Groups repeats of the same fault. The message alone is too coarse — two
 * different routes failing on "Cannot read properties of undefined" are two
 * problems — so the innermost stack frame comes along.
 */
function fingerprint(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const frame = error.stack?.split("\n")[1]?.trim() ?? "";
  return `${error.name}: ${error.message} @ ${frame}`;
}

function shouldSend(key: string): boolean {
  const now = Date.now();

  if (now - windowStart > COOLDOWN) {
    windowStart = now;
    sentInWindow = 0;
    // The cooldown and the window are the same length, so nothing in here can
    // still be blocking once the window rolls over.
    lastSent.clear();
  }

  if (sentInWindow >= MAX_PER_HOUR) return false;

  const previous = lastSent.get(key);
  if (previous !== undefined && now - previous < COOLDOWN) return false;

  lastSent.set(key, now);
  sentInWindow += 1;
  return true;
}

export function reportServerError(error: unknown, request: Request): void {
  // A visitor navigating away mid-request aborts it. Nothing is wrong.
  if (request.signal.aborted) return;

  // Route error responses are the app answering properly — a 404 for a
  // championship that does not exist is not a fault. A 5xx one is.
  if (isRouteErrorResponse(error) && error.status < 500) return;

  // An `ErrorResponse` carries the error that caused it on a property its
  // public type does not declare. React Router's own default handler unwraps it
  // the same way; without that, a 500 would report as "[object Object]".
  const unwrapped = isRouteErrorResponse(error)
    ? ((error as { error?: unknown }).error ??
      new Error(`${error.status} ${error.statusText}: ${String(error.data)}`))
    : error;

  console.error(unwrapped);

  if (!ALERT_EMAIL) {
    console.warn("[error-report] ALERT_EMAIL is not set — no mail sent.");
    return;
  }

  if (!shouldSend(fingerprint(unwrapped))) return;

  const url = new URL(request.url);
  const message =
    unwrapped instanceof Error ? `${unwrapped.name}: ${unwrapped.message}` : String(unwrapped);
  const stack = unwrapped instanceof Error ? (unwrapped.stack ?? "") : "";

  const body = [
    message,
    "",
    `${request.method} ${url.pathname}${url.search}`,
    new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" }),
    "",
    stack,
  ].join("\n");

  // Not awaited: the request is already on its way to an error page, and a
  // slow mail must not hold it up. A failure here is the one place left with
  // nowhere to report to, so it goes to stderr.
  void sendMail({
    to: ALERT_EMAIL,
    subject: `[runde.tips] ${message.slice(0, 120)}`,
    ...opsMail(body),
  }).catch((err) => console.error("[error-report] mail failed:", err));
}
