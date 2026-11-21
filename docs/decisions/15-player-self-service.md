# Players Tip, Enter Results and See Their Sessions Themselves

**Status: planned (2026-11-20).** Schema agreed for all three features; none
of the player-facing UI is built yet. The manager part of feature 1 can be
built ahead of the rest.

**Update 2026-11-22:** the manager part of feature 1 is built (v3.9.0) — see
[Manager part](#manager-part--built-v390). The schema migration is on prod
since 2026-11-20. Everything player-facing is still open.

Until now only a manager touches the data: tips arrive by Excel, results are
typed in by hand. Three features hand part of that to the players
themselves. Each brings columns; this record fixes them, and the reasoning,
before the features are built, so the migrations can go in as one.

Common ground for all three:

- **Timestamps are UTC ISO strings** (`new Date().toISOString()`), as
  `sessions.expires_at` already is. Comparisons against "now" are plain
  string or `Date` comparisons, independent of the server's time zone and of
  daylight saving. Europe/Berlin exists only at the edges: entered there,
  shown there (`@internationalized/date`, already in via React Aria).
- **Every new column is nullable or has a default — no backfill.** Old rows
  keep meaning what they meant. Each change is a plain `ADD COLUMN`, which
  works the same on plain SQLite should we leave Turso (see
  [02-hosting-railway.md](./02-hosting-railway.md)).
- **Migrate prod before deploying the code.** Many queries read these tables
  without restricting columns, so the columns have to exist first — the same
  order as `championships.leader_id`.

## 1. Players enter their own tips

The Excel sheet is not always at hand, a phone with a browser usually is.

### When a player may tip

Server-side, all of these must hold:

- the player has a `players` row in the championship;
- the championship is published and not completed;
- the round is published and not completed;
- **`rounds.starts_at` is set and still in the future.**

The start is a point in time, entered to the minute in Europe/Berlin. A round
without one cannot be tipped at all. That is the switch for the manager, and
it also protects the legacy championships still to be imported: should one
of them be left running by accident, nobody can tip into it, because none of
its rounds has a start.

The joker rules the manager's tip grid enforces (`tipps.tsx`) apply to the
player's own input as well.

### "Tipps öffentlich" before the start

Once players tip themselves, publishing tips before the start would let
everyone copy. **The "Tipps öffentlich" switch is locked while `starts_at` is
set and in the future.** Without a start nothing changes — the manager's
workflow for imported and manually entered championships stays as it is.

### Who changed a tip

`tips.updated_by` (user id) and `tips.updated_at` record the **last** change —
by the player or by a manager in the grid. No history; only the last state
matters. Existing and imported tips leave both empty: unknown.

### Open: changing tips before the start

Whether a player may still change a submitted tip until the start is for the
whole Tipprunde to decide. Likely yes — corrections happen today as well.
Either way it is a server-side check, not schema: a submitted tip is an
existing `tips` row, and the columns above already record the last change.

### No mail per tip

Saving tips sends **no** mail. One per save would be far too many. How the
championship leader gets the tips instead — the leader requesting a summary
mail from the app at any time, or a manager sending one — is still open, and
needs no schema either. Reminders by mail or WhatsApp stay the leader's own
business; the app sends none.

### Open-tips hint

Logged-in players see a hint while they have open tips: "Runde 3 startet
Sa 15:30 – dir fehlen noch 4 Tipps". It is computed from `starts_at` and the
existing tips, shows only while something is actually missing and the round
has not started, and disappears by itself after that. An × hides it for that
round, remembered in a cookie. **No user setting, no column:** a hint that
only appears when there is something to do needs no switch.

### Manager part — built (v3.9.0)

Built as planned, plus two details found on the way: a **future start is
refused once the round's tips are public** (it would reopen tipping while
everyone's tips are visible), and **Enter in the field saves**, as in a plain
input — Enter in the calendar popover still picks a day.

The championship page's round row gets a **"Start"** field: date and time to
the minute, 24-hour, always Europe/Berlin, clearable. A new generic
`DateTimeField` in `@tipprunde/ui` (React Aria `DatePicker` with
`granularity="minute"`) beside the existing date-only `DateField`; a new
action intent `set-round-start`. Locked like the switches once the
championship or the round is completed; still editable after the start, for
a postponed match.

## 2. Trusted players enter results

Selected players may enter a match result before a manager does, so the table
updates while the matchday is still running. The table then has a
provisional, "live" character until a manager or admin approves.

### The permission

**`users.can_enter_results`**, boolean, not null, default false — **not a new
role.** Trust is orthogonal to the role: a trusted player is still a `user`,
with one extra right. A new role value would also slip through existing
checks such as `role === "user"` in the user area, which would treat it like
a manager. Whoever disqualifies themselves loses the tick, nothing else.

### Three columns on `matches`

| Column               | Content                                        |
| -------------------- | ---------------------------------------------- |
| `result_entered_by`  | user who entered the current result            |
| `result_entered_at`  | when                                           |
| `result_approved_by` | manager or admin who approved; empty = pending |

Why `result_…` rather than a general `updated_by`: a manager also edits a
match's date, league and teams, and every schedule change would overwrite a
general column.

Why an explicit approval column rather than "the last one to touch it was an
admin": roles are read fresh per request, so a later demotion would
retroactively void old approvals; the check "any pending result in this
round?" stays a plain `WHERE` without a join on `users`; and both people stay
on record, which is exactly what judging a trusted player needs.
`result_approved_at` is left out — when it was entered matters, when it was
approved does not.

### Rules

- **Pending** means `result_entered_by` set and `result_approved_by` empty.
  Legacy and imported results have both empty and count as approved.
- **First in wins**, atomically:
  `UPDATE matches SET result = ?, result_entered_by = ?, result_entered_at = ?
  WHERE id = ? AND result IS NULL`. No row changed — someone was faster.
  After that the trusted player cannot change it.
- **Not before the matchday:** only when `matches.date` is today or earlier
  (Europe/Berlin). Kick-off times are deliberately not recorded; a player who
  keeps entering results early simply loses the permission.
- **A manager or admin enters or corrects:** `result_entered_by` and
  `result_approved_by` are both set to them — approved at once.
- **Approve:** set `result_approved_by` only.
- **Reject:** clear the result and all three columns; the match is open again
  for the next one.
- **Points** are computed at once, as today — that is the live table. The UI
  marks pending results.
- **A round cannot be completed** while it holds a pending result, on top of
  `isRoundCompletable`.
- **Who approves:** managers and admins.

## 3. Players see and end their sessions

With players tipping and entering results, being logged in matters more. A
player sees their sessions and can end the ones they do not recognise.

### One column

**`sessions.user_agent`**, the raw `User-Agent` header, stored once at login
in `createUserSession`. Parsed only for display, so a better parser later
applies to old sessions too. The login time is `sessions.created_at`, the
expiry `expires_at` — both already there. Sessions from before the migration
show as "Unbekanntes Gerät" and expire on their own.

**Parsing** is a small helper of our own (iOS, Android, Windows, macOS, Linux;
Safari, Chrome, Firefox, Edge, Samsung Internet), not a library:
`ua-parser-js` is AGPL from version 2 on, and the 1.x line is more than these
few cases need.

**Deliberately not recorded:**

- **Last activity** — a write on every request. Session middleware does not
  write today, and with the Turso free tier's limits in sight it should stay
  that way.
- **IP address or location** — ruled out in
  [07-observability.md](./07-observability.md).

### Behaviour

- A page of the player's own, e.g. `/konto`, reached from the user area: the
  unexpired sessions, newest first — device and browser, login time in
  Europe/Berlin, expiry.
- The current session (matched against the cookie's session id) is marked
  "Dieses Gerät" and has no delete button — logging out ends it.
- Ending another session: the server deletes only a session that belongs to
  the logged-in user and is not the current one.
- Unchanged: logging a user out in the manager deletes all their sessions; a
  changed email still revokes them.

## The migration

Eight columns, all `ADD COLUMN`, no backfill:

| Table      | Column               | Type                                   |
| ---------- | -------------------- | -------------------------------------- |
| `rounds`   | `starts_at`          | text, nullable                         |
| `tips`     | `updated_by`         | integer → `users.id`, nullable         |
| `tips`     | `updated_at`         | text, nullable                         |
| `matches`  | `result_entered_by`  | integer → `users.id`, nullable         |
| `matches`  | `result_entered_at`  | text, nullable                         |
| `matches`  | `result_approved_by` | integer → `users.id`, nullable         |
| `users`    | `can_enter_results`  | integer (boolean), not null, default 0 |
| `sessions` | `user_agent`         | text, nullable                         |
