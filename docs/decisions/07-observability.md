# Observability — auth events, error mails, alerts

**Status: built (2026-09-04) on `feat/observability`.** Four pieces, in the
order they had to happen: the `auth_events` table and the logging that fills
it, an error mail on unhandled server errors, an alert mail when failed
sign-ins pile up, and `/manager/sicherheit` to look at the result. Rate
limiting is deliberately **not** built — see the last section.

The gap this closes: nothing told anyone that something had gone wrong. The
error page says "Bitte versuche es später noch einmal" and offers no way to
report anything, so a server error only became known if a user happened to
mention it. Failed sign-ins left no trace at all.

## No Sentry

Considered and dropped. It is another account, another SDK in the bundle, and
another place the data lives — for a site with around twenty users whose whole
error surface is one Node process. What was actually wanted is "tell me when
something breaks", and a mail does that. Resend is already wired up for the
login code, so the alert path is `sendMail()` and nothing new.

## No IP addresses

The table records the attempted address and, where one matched, the user — but
never the caller's IP. Behind Railway's proxy an address says little without a
lookup service, and it is the one field here that would turn a log into
personal data worth protecting. Retention is 90 days.

The prune runs from the write path rather than a schedule: the table only grows
when somebody signs in, so the moment a row is added is exactly when a prune is
worth considering. An in-memory timestamp keeps that to one `DELETE` a day.

Timestamps are written by the app as ISO strings, not left to the column's
`CURRENT_TIMESTAMP` default. SQLite writes `2026-09-04 12:52:06`, which does
not compare correctly against an ISO string — and every read of this table is a
comparison: the prune cutoff, the alert window, the newest-first order.

## `handleError` is injected, not revealed

React Router resolves its error hook as `build.entry.module.handleError`, with
a `console.error` fallback when it is absent. The documented way to supply one
is to reveal `entry.server.tsx` and export it from there.

We inject it into the build object in `server/app.ts` instead. Same coverage —
loaders, actions, resource routes and document rendering all go through that
one handler — for six lines instead of owning 86 lines of streaming, bot
detection and timeout handling that we would then have to keep in step with
every React Router release. The build object is already in hand two lines up,
in a file that is hand-rolled on purpose anyway (see `02-hosting-railway.md`).

Two consequences, both accepted:

- **Production only.** `react-router dev` runs its own Vite server and never
  loads `server/app.ts`. That suits an alert mail — nobody wants one for every
  typo in a loader — but the path is exercised by `pnpm build && pnpm start`,
  not by `pnpm dev`.
- **No `context`.** The app's contexts live inside the bundle; a copy created
  out in `server/app.ts` would be a different object and never match. So the
  report carries the request, not the user. The auth log covers the rest.

`error-report.server.ts` is therefore loaded by Node directly, with type
stripping: no JSX, no `import.meta.env`, and relative imports need their file
extension, which the rest of `lib/` gets away without only because Vite
resolves it.

## What is not a fault

Aborted requests send nothing — a visitor navigating away mid-request is not an
error. Neither are route error responses below 500: a 404 for a championship
that does not exist is the app answering correctly.

Repeats are grouped by message plus innermost stack frame. One mail per
distinct error per hour, ten an hour at most, so a fault in a loop cannot fill
a mailbox with the same line.

## The alert threshold

**More than five failed attempts within ten minutes.** The number comes from
the shape of this site rather than a standard: a round has around twenty
players, and a legitimate person mistypes twice and then asks Micha.

Counted across the whole site, not per address. Without IP addresses the
address is the only handle there is, and anyone working through a list of
guesses would stay under a per-address threshold forever.

An expired code does not count — that is someone who asked for a code and got
to it too late. A technical failure does not either; that is a fault, and it
has its own mail.

One alert an hour. An attack that keeps running is still one attack.

## `ALERT_EMAIL` has no default

Unset, errors and alerts are logged and nothing is sent. A guessed default
would file reports in a mailbox nobody reads, which is worse than none.

## Rate limiting: deliberately later

It was on the original list, and it is not built. Nothing in the data yet says
where a limit belongs — the table has existed for a day. A limit set from
imagination either sits so high it never fires or locks out the one player who
forgot which address they registered with.

The alert is the measurement. Once it has fired a few times, or has not fired
for a season, the shape of a real limit will be obvious. That is when to build
it.
