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

## Archiv overview

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

Do this one before the heading fix if both land together — otherwise the heading
gets decided twice.

**Waits for the remaining legacy imports.** Fourteen championships make the
shape decidable; four do not.

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
2. **Archiv** — the discussion, then the heading. After the imports.
3. **Chat** — last of the features, and knowingly.
4. **Apex move** — when the history is in.

**Import payload cleanup** and the **blog** are not in this order: the first
only becomes worth doing if payload size ever actually bites, the second moves
whenever there is something written.
