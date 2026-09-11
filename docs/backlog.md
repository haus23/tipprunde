# Backlog

Loose ends, grouped by what actually belongs in one branch — same files, same
line of thinking. Not an issue tracker: there is one developer, and the point of
grouping here is to avoid the two things that cost real time, namely two branches
editing the same file and a decision made twice.

Items carry what is **known** and what is **open**. Where a note says "verified",
the claim was checked against the code or the database, not remembered.

**Finished items are removed rather than crossed out.** Whatever reasoning was
worth keeping moved to where the code is: the `docs/decisions/` record, the
`CLAUDE.md` rule, or a comment at the site itself. This file stays short enough
to be read in full.

---

## Archiv

One scale problem with three faces — the overview list, the switcher, and what
the all-time table has to compensate for — plus two additions that only make
sense once the first is decided. Mostly `routes/public/archiv/index.tsx` and
`routes/public/championship/_switcher.tsx`.

**Waits for the remaining legacy imports.** Fourteen championships make the
shape decidable; four do not.

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

Everything else in this section follows from how this is answered.

### The switcher drops "Alle Turniere" — verified, and worse than it looks

`ChampionshipSwitcher` lists every published championship and pins **Alle
Turniere** underneath as the last `MenuItem`. Both ways to reach it fail as the
list grows, and they fail in opposite directions:

- **Without a query** it sits below all of them — nine entries today, roughly
  forty-five once the history is in, so it scrolls out of reach.
- **With a query** it disappears entirely. It is a `MenuItem` inside the same
  `Autocomplete`, so the filter applies to it too. Verified in the browser:
  typing `rück` leaves four championships and no **Alle Turniere** at all.

That matters more than a bit of scrolling, because the component's own docblock
records that this is the only way in and out of the Archiv — there is
deliberately no header nav entry. Losing the item means losing the entrance.

Two directions, neither decided: keep it inside the menu but exempt from the
filter, or lift it out of the filtered collection into a fixed footer of the
popover, next to the search field that is already pinned outside the scroll
area.

### Wins column in the all-time table — depends on the first item

If the overview stops showing every championship, the all-time table is where a
reader would look for "who actually won things", and today it only shows rank,
name, points and games played.

The data is one aggregate away — `getArchivChampionshipList()` already reads
`players` at `rank: 1`. Two details to get right, both of which the existing
code already knows about:

- **Count only completed championships.** `rank` is live-updated all season, so
  the running championship would contribute a false win.
  `getEwigeTabelle()` deliberately does the opposite for points — provisional
  totals count. The two aggregates would therefore disagree on which
  championships they span, on purpose, and that is worth a comment at the site.
- **Shared first places count for everyone who shares them** — `groupWinners()`
  exists precisely because several players can hold `rank: 1`.

### Per-player results view — new

Clicking a player in the all-time table opens their record: one row per
championship with placing and points, a player select on top. Today the table
links championships but not players.

- **The select-on-top shape already exists twice**, at `/tipps/:playerSlug?` and
  `/verlauf/:playerSlug?`. Follow it rather than invent a third. Note those two
  are championship-scoped and therefore mounted twice
  (see [05-championship-scope.md](./decisions/05-championship-scope.md)); this
  one is cross-championship like `/archiv` itself, so it mounts once.
- **The URL needs a decision.** `archiv/:slug` already owns that segment. A
  static sibling such as `archiv/spieler/:playerSlug?` does win over the dynamic
  route in React Router's ranking, but it permanently reserves `spieler` as a
  championship slug. A separate top-level path avoids that.

### Redundant heading — ready

`<h2>Turniere</h2>` sits directly above a table whose first column header is
`Turnier`. One of the two goes. Verified, one line.

Do this last, or at least after the shape question — otherwise the heading gets
decided twice.

## Import payload cleanup — noticed in passing, not urgent

Two fields go into every `import.json` unconditionally null, verified against
`import.server.ts` while building the Hinrunde 2006/07 payload:

- **`tips[].points`** — genuinely dead. Grep across `import.server.ts` turns up
  no read of it anywhere; points are always recomputed via `calcTipPoints()`,
  never trusted from the JSON. Required by `tipSchema` (`v.nullable`, not
  `v.optional`) even though the value never matters. Could be dropped from the
  schema entirely — a pure simplification, no behavior change.
- **`matches[].lowestSumBonus`** — not dead, this one really is written straight
  into the DB from the payload. Always `null` by our own convention (the
  "niedrigste Spielsumme verdoppelt" doubling only ever gets applied via the
  round-completion toggle in the manager, never at import time). Could become
  `v.optional()` with a `null` default, so the JSON can omit it instead of
  spelling it out on every match.

Measured on the Hinrunde 2006/07 payload (61 matches, 1159 tips): stripping both
would cut the compact JSON from 120 KB to 103 KB — about 15%. Worth doing if a
later, bigger championship pushes payload size toward the territory
[08-import.md](./decisions/08-import.md) discusses alternatives for; cheaper
than any of those, so it is the first lever to pull, not something to do
speculatively now.

## Blog

Outlined, not built. The prose folder and the frontmatter convention exist at
`apps/web/content/`, so the writing can start; the rendering side is still
open, along with the decision record slot `docs/decisions/09-blog.md`. The
README in that folder carries the dependency and build-vs-SSR analysis.

## Chat

And, unavoidably before it, moving the dev server onto `server/app.ts`. See
[decisions/01-chat.md](./decisions/01-chat.md); the reasoning is there in full
and is not repeated here.

## Apex move as go-live

Once the history is complete, `runde.tips` leaves the legacy stack and `next.`
goes away.

---

## Suggested order

1. **Legacy imports** — running, championship by championship. Tracked outside
   the repo, not here.
2. **Archiv** — the shape question first; the switcher, the wins column, the
   per-player view and the heading all read off that answer. After the imports.
3. **Chat** — last of the features, and knowingly.
4. **Apex move** — when the history is in.

**Import payload cleanup** and the **blog** are not in this order: the first
only becomes worth doing if payload size ever actually bites, the second moves
whenever there is something written.
