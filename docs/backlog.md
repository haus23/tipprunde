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

One branch. All of it lands in `routes/manager/_sidebar.tsx` and the question
"what belongs under Administration", so splitting it means editing that file
three times.

### Move the Legacy import into Administration

The `Administration` group exists since v1.6.0 and holds `Sicherheit`. The
import is an admin tool too and sits in the championship group only because it
predates the group.

**Wrinkle:** the route is championship-scoped (`/manager/:slug/import`) while
the Administration block renders regardless of a championship. The nav item
needs a `slug` guard the other entries in that block do not.

### "Alle Sitzungen beenden" for one player

Deferred since v1.5.0, when changing an address started revoking sessions
automatically. `revokeUserSessions()` in `lib/session.server.ts` already does
the work and takes an optional session to spare.

**Settled:** it ends _one player's_ sessions, and it belongs on the Spieler
page — same place as the address that would prompt it.

**The real problem is the path to it.** Today every player action hides behind
a two-step route: find the row, open the edit dialog, act. For "throw this
account out now" that is both slow and unintuitive — it is not an edit, and it
does not belong on a form whose Save button does something else. Wanted
instead: reachable from the row, with its own confirmation dialog, because it
cannot be undone and logs a real person out.

**Not on `/manager/sicherheit`.** That page is a log and should stay one —
mixing "what happened" with "do something about it" makes a read-only page
dangerous to click around in. What would earn its place there is the opposite
direction: an event row linking _to_ the player, so the log leads to the action
instead of containing it.

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

1. **C (login)** — a real bug that strands a user in a form the server has
   already forgotten. Small, and on the one flow everybody touches.
2. **B (sorting)** — a daily irritation, mechanical, no decisions left.
3. **A (navigation)** — the import move is trivial; the session action needs a
   route out of the edit dialog first.
4. **D (Archiv)** — the discussion, then the heading.
5. **E** — as time and mood allow; the chat last, and knowingly.
