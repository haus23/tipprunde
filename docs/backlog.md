# Backlog

Loose ends, grouped by what actually belongs in one branch — same files, same
line of thinking. Not an issue tracker: there is one developer, and the point
of grouping here is to avoid the two things that cost real time, namely two
branches editing the same file and a decision made twice.

Items carry what is **known** and what is **open**. Where a note says
"verified", the claim was checked against the code or the database, not
remembered.

---

## A · Manager navigation and Administration

### Move the Legacy import into Administration — done

Was championship-scoped (`/manager/:slug/import`) purely because it predated
the `Administration` nav group; nothing about the tool itself needed a
championship in the URL. Rather than guard the nav item for the missing
`slug`, the route became championship-agnostic: `/manager/import` now carries
its own picker — a `Select` of open (not completed) championships, newest
first and preselected, built with the same RAC pattern as the ruleset picker
in `_turnier-dialog.tsx`. `getOpenChampionships()` in `championship.server.ts`
backs it.

This also fits where the tool is headed. The JSON shape it imports
(`import.server.ts`) still mirrors the legacy MySQL dump, but the dump is not
the only source queued up — the running runde.tips prod DB and the
organiser's own spreadsheet are both later imports (see
`project_legacy_import.md`, outside the repo). Every source has to become the
same JSON; only the destination championship was ever tied to a URL, and now
it is a field instead. The page and nav label are "Import", not
"Legacy-Import".

Found and fixed in passing: RAC's `FieldError` renders nothing unless the
field it sits in is `isInvalid` — passing it error text as children is not
enough on its own. The original page had exactly this bug on the JSON field
(a single `JSON.parse` failure showed nothing; only two or more validation
issues fell back to the bullet list below). Both fields now set
`isInvalid={!!errors?.field?.length}` explicitly.

### "Alle Sitzungen beenden" for one player — done

Deferred since v1.5.0, when changing an address started revoking sessions
automatically. `revokeUserSessions()` already did the work and already took
an optional session to spare — only the trigger and the path to it were
missing.

**Admin-only, and address untouched.** A second icon button beside the pencil
on `/manager/spieler`, gated in the loader (`canRevokeSessions`) and re-gated
in the action itself, the same way `sicherheit.tsx`/`import.tsx` gate their
own routes — a plain manager can still edit players, but not end their
sessions. Behind a confirmation dialog (`_sessions-dialog.tsx`, the
`_runde-dialog.tsx` shape reused), because it cannot be undone and logs a real
person out. Logged the same way an address change already is —
`sessions_revoked` in `auth_events`, distinguished by its `detail` text
("Manuell beendet durch …" vs "Adresse geändert durch …").

Stayed off `/manager/sicherheit` as planned — that page still only reads.

### Stale sessions, across all users — done

Came up while building the above, not originally on this list.

Not "when it could happen" but "when doesn't it": every session has a fixed
`expiresAt` set once at login and nothing ever renews it, so every session a
user does not explicitly log out of eventually sits in the table dead. Logout
is the only path that removes a row before its natural expiry, and most
people just close the tab.

No button. Unlike ending one player's sessions, there is no judgment call
here — expired means expired, always safe to delete. A button would imply a
reason not to.

Piggybacks on `createSession()` — the exact `pruneAuthEvents()` shape from
`auth-events.server.ts`, an in-memory `lastPrune` throttled to once a day, so
a login is "the table just grew, worth considering a sweep" the same way an
auth event write already is. No cron: this app has none on purpose (Railway,
single process). At ~23 users the table never gets large enough to matter
either way — this is tidiness, not a performance fix.

## B · Sorting German names

Its own branch — agreed once the scope became clear. One systematic fix,
and **not** a language setting: verified.

The database sorts with SQLite's BINARY collation, which orders by code point.
`Ö` is U+00D6, past `Z` at U+005A, so `Österreich` lands after `Zypern` — which
is exactly what shows up in the team picker. The app's `I18nProvider
locale="de-DE"` governs formatting, not what the database returns.

Verified against the dev database: `ORDER BY name` ends
`… Werder Bremen, Zypern, Österreich`. Every umlaut is misplaced, not only the
leading one — `Südafrika` sorts after `SpVgg Greuther Fürth` because `ü` is past
`p`. German (DIN 5007-1) sorts `ü` as `u`.

**Eight query sites are affected**, all ordering by a German name:

| File                              | Column                            |
| --------------------------------- | --------------------------------- |
| `manager/championship/spiele.tsx` | `teams.shortName`, `leagues.name` |
| `manager/championship/index.tsx`  | `name`                            |
| `manager/teams.tsx`               | `shortName`                       |
| `manager/ligen.tsx`               | `shortName`                       |
| `manager/spieler.tsx`             | `name`                            |
| `manager/turniere.tsx`            | `name`                            |
| `manager/regelwerke.tsx`          | `name`                            |

**Approach:** sort in JS with `Intl.Collator("de-DE")` after fetching. The
lists are master data — a few hundred rows at most — so the cost is nil and the
result is correct German ordering, including `ß` and case. A shared comparator
in `lib/utils.ts` beside `formatDate()` and `slugify()`, so the next list gets
it without thinking. `COLLATE NOCASE` is not an option: it handles case, not
umlauts.

---

## C · Login flow after a burnt code

**A bug, not a nicety.** Corrected after the first reading of this file got it
backwards.

After the third wrong code (`TOTP_MAX_ATTEMPTS`, default 3) and after an
expired one, the action unsets `pendingEmail` and returns an error — but the
page **stays on the code step**, showing "Zu viele Fehlversuche. Bitte fordere
einen neuen Code an." with no way to do that.

The cause is a status code. React Router skips loader revalidation when an
action answers with an error — `router.js`:

```js
let shouldSkipRevalidation = actionStatus && actionStatus >= 400;
```

`fail()` in `routes/public/login.tsx` answers **400**, so the loader never
re-runs and the step never flips, even though the cookie has already been
cleared. The "Andere E-Mail" button works only because `start-over` returns
`data(null)` with **200**.

So the form on screen no longer matches the session behind it. Typing a code
into it hits `if (!email) return fail({ error: "Keine oder abgelaufene
Anmeldung!" })` — a second, more confusing message for a state the user never
chose.

**Fix:** `redirect("/login")` on those two branches instead of `fail()`. A
redirect always runs the loader afresh, which is the whole point. The message
and the address travel in the session — `createCookieSessionStorage` has
`flash()`, and the session is being committed on that response anyway. The
loader reads them and hands them to the address step.

**Decided: the two cases prefill differently.**

- _Too many attempts_ → prefill. Seconds have passed in the same sitting,
  somebody is actively at the keyboard, and the address is already on screen.
  The field saves them retyping what they can see.
- _Expired code_ → leave it empty. Ten minutes or more have passed, which is
  exactly when the person at the machine may no longer be the one who typed the
  address. Putting it back does not remind them of it — it hands it to whoever
  is sitting there now.

The test is not how bad a leak would be, but whether the person can have
changed in between. That also separates this from the deliberate disclosure on
the address step ("Unbekannte E-Mail Adresse. Frag Micha!"): that one requires
already knowing the address to type it; a prefill gives it away.

Decided this way knowing it will rarely come up in a round of twenty friends.
Rarity is not a reason to get it wrong.

## D · Archiv overview

Two items, one file (`routes/public/archiv/index.tsx`), but only one of them is
ready to build.

### Redundant heading — ready

`<h2>Turniere</h2>` sits directly above a table whose first column header is
`Turnier`. One of the two goes. Verified, one line.

### More than ten championships — decide first

The list is a plain table of every published championship. With the 2002-onward
history fully entered it will be twenty-plus rows, and the all-time table sits
below it — so the interesting part gets pushed off the screen.

**Nothing to build until the shape is decided.** Worth knowing before
discussing:

- The two tables answer different questions (which season, and who is best
  overall) and are only stacked because there were four rows.
- Championships already have a `nr`, so any grouping by era or decade is free.
- `/archiv/:slug` already works as a destination, so the overview may not need
  to show much per row at all.

Do this one before the heading fix if both land together — otherwise the
heading gets decided twice.

---

## E · Carried over, unchanged

Deferred earlier with reasons that still hold.

- **Global `prefers-reduced-motion`** — from the responsive-manager branch.
- **The 13 remaining 28px icon buttons** — same branch; below the 44px touch
  target, deliberately postponed rather than fixed piecemeal.
- **Next legacy import** (championship 8) — the dump and the method are proven;
  this is data entry, not code.
- **Chat** — and, unavoidably before it, moving the dev server onto
  `server/app.ts`. See [decisions/01-chat.md](./decisions/01-chat.md); the
  reasoning is there in full and is not repeated here.
- **Apex move as go-live** — once the history is complete, `runde.tips` leaves
  the legacy stack and `next.` goes away.

---

## Suggested order

1. **C (login)** — done.
2. **B (sorting)** — done.
3. **A (navigation)** — done.
4. **D (Archiv)** — the discussion, then the heading.
5. **E** — as time and mood allow; the chat last, and knowingly.
