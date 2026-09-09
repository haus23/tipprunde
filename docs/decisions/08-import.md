# Import — JSON schema, why a textarea, and what would change at scale

**Status: built (2026-09-04), championship-agnostic since v1.7.0
(2026-09-09).** `/manager/import` — a manual, admin-approved way to write a
whole championship's rounds, matches, and tips into the database in one
transaction. Built for the legacy MySQL dump, but not tied to it: the JSON
shape is the interface, and the running runde.tips prod DB and the
organiser's own spreadsheet are both queued up as later sources. Whatever
produces the JSON is somebody else's problem — usually mine, worked out
interactively outside this repo — this page only has to accept it.

## The JSON schema

Enforced by `importSchema` in `lib/import.server.ts` (Valibot, `v.safeParse`
against the pasted text — an invalid shape fails loudly with a path per
issue, never a guess):

```ts
{
  championshipSlug: string;
  newTeams: { id: string; name: string; shortName: string }[];
  newLeagues: { id: string; name: string; shortName: string }[];
  players: string[];              // existing user slugs
  matches: {
    nr: number;
    roundNr: number;
    date: string | null;
    leagueId: string;
    hometeamId: string;
    awayteamId: string;
    result: string | null;
    lowestSumBonus: boolean | null;   // always null on import — see below
  }[];
  tips: {
    matchNr: number;
    playerSlug: string;
    tip: string;                  // "" for no tip, never null
    joker: boolean | null;
    extraJoker: boolean | null;
    points: number | null;        // always null on import — see below
  }[];
}
```

**References are stable IDs and numbers throughout, never raw database
foreign keys.** `roundNr` instead of `roundId`, `matchNr` instead of
`matchId`, `playerSlug` instead of `userId` — none of those rows exist yet
when this JSON is written, only once the import actually runs and creates
them. `newTeams`/`newLeagues` follow the same rule one level up: an id the
rest of the JSON can point at, created if missing, updated if it already
exists (`onConflictDoUpdate` — safe to re-run the same file after a fix).

**Two fields are always `null` on the way in, on purpose:**

- `tips[].points` — never imported, always recomputed via `calcTipPoints`.
  Points in the database are always _our_ calculation, never a legacy
  number, regardless of source.
- `matches[].lowestSumBonus` — likewise never imported. It only gets set by
  completing a round in the manager (`toggle-round-completed`,
  `championship/index.tsx`), which is a separate, deliberate step from the
  import itself. **A re-import of an already-completed round resets this
  field to `null` again**, because the JSON always writes `null` for it;
  the round then needs completing again (off, then on) to reapply the
  doubling. Not a bug — it follows directly from "the JSON is not the
  source of truth for computed values" — but easy to forget after a
  correction and re-import.

Everything happens in one transaction — any failure rolls back completely,
never a partial import.

## Why a textarea, not a file upload

The form is one `Select` (which championship) and one `TextArea` posting a
single `json` string field — the same one-fetcher-one-action shape every
other mutation in this app already uses. No multipart handling, no new
endpoint, no separate upload step.

That fits how the JSON actually gets made: it is built and reviewed outside
the browser first — in an editor, against the real data, with a human
deciding what a name means before it ever becomes an id. Pasting it into
the textarea is the last step of that process, not the first, and having it
sit there as plain, visible, editable text is itself one more chance to
glance at it before committing to the import. A file picker would remove
that — the content stops being something you look at and becomes something
you just select.

It also matches how often this runs: a handful of times a year, one
championship at a time, always by an admin who was already looking at the
data. Upload infrastructure buys nothing at that frequency that a plain
string field doesn't already do just as well.

## Outlook: if the payload outgrows a textarea

The largest run so far (`rr0506`: 49 matches, 931 tips, 5 new teams, 3 new
leagues) produced a **106 KB** JSON payload. Worth being precise about what
that number does and doesn't mean:

- **Nothing in this app's own stack caps the request body.** `server/app.ts`
  passes no size limit to `createRequestListener`, and neither Node's raw
  HTTP server nor React Router's `request.formData()` impose one by
  default. Whatever ceiling exists sits on Railway's side, and I haven't
  measured or looked up what that is — not a risk at 106 KB regardless.
- **The friction that will actually show up first is not transport or the
  database — it's the human at the textarea.** Scrolling and eyeballing a
  few hundred KB of JSON in a small box stops being pleasant well before it
  stops working. That is the thing worth watching for, not a request-size
  error.

Three ways this could be addressed, if it ever needs to be — evaluated
against what the textarea choice above was actually optimizing for
(reviewability before commit, and reusing the plain-form-field shape):

- **Compress the JSON and upload it as a file.** Solves bandwidth, which
  isn't the constraint — 106 KB is nothing to transfer, compressed or not.
  Worse, it actively works against the one property this design cares
  about: a zip is _less_ reviewable than plain text, not more. Would only
  earn its cost if payloads reached multi-MB territory, which nothing about
  how imports are scoped (one championship at a time) points toward.
- **Plain file upload, no compression.** The more promising of the two
  upload options, if the textarea itself becomes the bottleneck. Keeps the
  content as ordinary readable text — the admin picks the already-reviewed
  file instead of re-pasting it — and removes any question of whether the
  browser handles a very large textarea gracefully. Small change:
  `request.formData()` already hands back a `File` for a file input; reading
  it is one `.text()` call. The cost is losing the "one more glance in the
  browser" step — a small loss, since the file was already reviewed in an
  editor before this point.
- **A different format (CSV/NDJSON, one file per table) instead of JSON.**
  Doesn't touch the actual scaling axis — the tip count grows with
  players × matches regardless of how it's encoded — and it breaks the
  single-transaction, all-or-nothing guarantee `importLegacyData` currently
  gives, in exchange for files that are arguably easier to skim per table.
  Not worth the fragmentation for a problem that isn't about format.
- **Split into several smaller imports (e.g. one per round).** The one
  option that actually shrinks a single request, and it maps onto a real
  boundary in the data (rounds are already how the domain is chunked). The
  real cost: it trades away the "whole championship commits or nothing"
  guarantee for "this round commits or nothing" — a failure on round 3
  would need a manual check for whether rounds 1–2 already landed, instead
  of the current clean rollback.

**Not doing any of this now.** Nothing here is close to a real limit — 106
KB is small by any measure, and the workflow only ever produces one
championship's worth of data at a time by design. If it ever does become a
real problem, plain file upload is the first thing to reach for: smallest
change, keeps the transaction and the "already reviewed before this point"
property intact, and only removes the one thing (a big textarea) that would
actually be causing the pain.
