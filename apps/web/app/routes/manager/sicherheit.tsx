import type { AuthEventType } from "@tipprunde/db/schema";
import { cx } from "@tipprunde/ui";
import { data } from "react-router";

import { getAuthEvents } from "#/lib/auth-events.server.ts";
import { userContext } from "#/lib/context.ts";
import { isAdmin } from "#/lib/session.server.ts";

import type { Route } from "./+types/sicherheit";

export const handle = { title: "Sicherheit" };

/** The address is in here, so this stays with the admins. */
export async function loader({ context }: Route.LoaderArgs) {
  if (!isAdmin(context.get(userContext))) {
    throw data("Nur für Admins.", { status: 403 });
  }
  return getAuthEvents();
}

const labels: Record<AuthEventType, string> = {
  code_requested: "Code angefordert",
  login_succeeded: "Angemeldet",
  unknown_email: "Unbekannte Adresse",
  code_invalid: "Falscher Code",
  code_expired: "Code abgelaufen",
  code_max_attempts: "Zu viele Fehlversuche",
  request_failed: "Technischer Fehler",
  sessions_revoked: "Sitzungen beendet",
};

/**
 * Only failures are coloured. Marking successes too — accent orange next to
 * error orange — made a page of signing in look like a page of alarms, which
 * is the opposite of what a glance at this should tell you. Everything normal
 * stays in the body colour, so what is left in red is what to look at.
 */
const failureTypes: AuthEventType[] = [
  "unknown_email",
  "code_invalid",
  "code_max_attempts",
  "request_failed",
];

function formatMoment(value: string) {
  const d = new Date(value);
  return {
    date: d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" }),
    time: d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
  };
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-subtle bg-surface-raised rounded-md border px-4 py-3">
      <div className="text-muted text-xs font-medium tracking-wide uppercase">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

export default function Sicherheit({ loaderData }: Route.ComponentProps) {
  const { events, logins, failures, total, limit, retentionDays } = loaderData;

  return (
    <div>
      <title>Sicherheit | Manager</title>

      {/* The window is said once, above the pair, rather than repeated in both
          labels — "Fehlversuche (24 h)" wraps to two lines at 375px and leaves
          the two cards reading at different baselines. */}
      <h2 className="text-muted mb-2 text-xs font-medium tracking-wide uppercase">
        Letzte 24 Stunden
      </h2>
      <div className="mb-6 grid grid-cols-2 gap-2 sm:max-w-md sm:gap-4">
        <Stat label="Anmeldungen" value={logins} />
        <Stat label="Fehlversuche" value={failures} />
      </div>

      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-subtle text-muted border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Ereignis
            </th>
            {/* Both fold into the first column below xs — three columns do not
                fit 375px without turning every address into an ellipsis. */}
            <th className="border-subtle text-muted xs:table-cell hidden border-b px-3 py-2.5 text-left text-xs font-medium tracking-wide uppercase">
              Wer
            </th>
            <th className="border-subtle text-muted xs:table-cell hidden w-28 border-b px-3 py-2.5 text-right text-xs font-medium tracking-wide uppercase">
              Zeitpunkt
            </th>
          </tr>
        </thead>
        <tbody>
          {events.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle py-16 text-center">
                Noch nichts passiert.
              </td>
            </tr>
          ) : (
            events.map((event) => {
              const { date, time } = formatMoment(event.createdAt);
              const who = event.user?.name ?? event.email ?? "—";

              return (
                <tr key={event.id} className="border-subtle border-b last:border-0">
                  <td className="px-3 py-3">
                    <div
                      className={cx(
                        "font-medium",
                        failureTypes.includes(event.type) && "text-error",
                      )}
                    >
                      {labels[event.type]}
                    </div>
                    <div className="text-subtle xs:hidden mt-0.5 truncate text-xs">
                      {date}, {time} · {who}
                    </div>
                    {event.detail && (
                      <div className="text-subtle mt-0.5 text-xs">{event.detail}</div>
                    )}
                  </td>
                  <td className="xs:table-cell hidden px-3 py-3">
                    <div className="truncate">{who}</div>
                    {/* The address as well when it is not what the name column
                        already shows — an attempt on a wrong address is only
                        readable if the address is on the line. */}
                    {event.user && event.email && (
                      <div className="text-subtle truncate text-xs">{event.email}</div>
                    )}
                  </td>
                  <td className="text-subtle xs:table-cell hidden px-3 py-3 text-right whitespace-nowrap tabular-nums">
                    <div>{time}</div>
                    <div className="text-xs">{date}</div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <p className="text-muted mt-6 text-xs">
        {total > limit ? `Die ${limit} jüngsten von ${total} Ereignissen.` : `${total} Ereignisse.`}{" "}
        Gespeichert wird {retentionDays} Tage lang, ohne IP-Adressen.
      </p>
    </div>
  );
}
