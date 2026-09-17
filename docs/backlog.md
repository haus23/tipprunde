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

The overview-list scale problem, the switcher, and the three-way navigation
gap around entering the Archiv mid-season are done — route shape, shared
chrome, the Übersicht/Tabelle/Verlauf rahmen, and the switcher's fixed
footer. See
[10-archiv-navigation.md](./decisions/10-archiv-navigation.md) for the why.

Two items left, both parked for a later feature branch:

### Wins column in the all-time table

The all-time table is where a reader would look for "who actually won
things", and today it only shows rank, name, points and games played.

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
- **The URL question is resolved.** Championships now live under
  `archiv/turnier/:slug`, not `archiv/:slug` directly — a static sibling like
  `archiv/spieler/:playerSlug?` no longer collides with anything or reserves
  `spieler` as a championship slug. No separate top-level path needed.

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
2. **Archiv** — navigation done; the wins column and per-player view remain,
   on a later feature branch.
3. **Chat** — last of the features, and knowingly.
4. **Apex move** — when the history is in.

**Import payload cleanup** and the **blog** are not in this order: the first
only becomes worth doing if payload size ever actually bites, the second moves
whenever there is something written.
