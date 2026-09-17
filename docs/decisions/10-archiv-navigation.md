# Archiv Navigation — Routing and Chrome Rebuild

**Status: done (2026-09-17).** Supersedes the route shape, navigation model
and "Decisions taken" table in
[05-championship-scope.md](./05-championship-scope.md); that doc's reframe
("a dimension, not a place"), content classification and secondary-content
reasoning are unaffected and stay the reference for those.

## Three problems, found once real data made them visible

05 designed the switcher-only navigation model when the dev DB had five
championships. At fourteen (and climbing — the legacy import is still
running), three gaps showed up that didn't exist at five:

1. **No way back to a prior season from inside one.** `/tabelle`, `/spiele`
   etc. for the running championship carried no chrome of their own — the
   only path to another season was via `/`.
2. **The Archiv link was reachable only through the switcher trigger** on the
   season title. No header nav entry (by design, see 05) meant it was easy to
   not notice it existed at all.
3. **Entering the Archiv at one championship's overview lost the thread once
   you left it.** Tabelle or Verlauf had no way back to that overview short of
   returning to `/archiv` and picking the same championship again.

## Route shape: `/archiv/turnier/:slug`

`/archiv/:slug` claimed the entire `/archiv/*` segment for a championship
slug — a future sibling like a per-player results page (still open, see
`docs/backlog.md`) would have had to either collide or permanently reserve a
word like `spieler`. Nesting the championship under `turnier/` frees the rest
of `/archiv/*` for siblings that aren't a championship at all.

```ts
route("archiv", "routes/public/archiv/index.tsx"),
route("archiv/turnier/:slug", "routes/public/archiv/_layout.tsx", [ ... ]),
```

Deliberately not covered by a redirect from the old shape — the community has
been told "new link" at every past hosting move (Vercel, Cloudflare, now
Railway), and the 404 page is clean. Shipped as a **major** bump, per the
root `CLAUDE.md` rule: a bookmarked or shared link 404ing is exactly the case
that rule calls out.

## Chrome: one shared layout, not two branch-specific ones

Fixes problem 1 and 2. `_championship-chrome.tsx` — prev/next season plus a
link to `/archiv` — is mounted **twice**, same file, via the same
double-mount trick `championshipViews()` already used for the six content
views (`{ id }` disambiguates):

- Around the running championship's Tabelle/Spiele/Spieler/etc. (previously
  chrome-free).
- Around every archived championship's views, replacing what used to be
  `archiv/_layout.tsx`'s own inline bar.

`getAdjacentChampionships(nr)` (renamed from `getAdjacentArchivChampionships`
— it was never archiv-specific) is the one query behind both: called with the
running championship's own `nr`, `next` resolves `null` on its own, no
branch-aware special-casing anywhere in the component or the query.

## The Übersicht/Tabelle/Verlauf rahmen

Fixes problem 3. A second shared layout, `_overview-nav.tsx` — title above,
three tabs (Übersicht | Tabelle | Verlauf) below, whichever is active as
plain text, the other two as links via `useScopedPath()` so they stay
branch-consistent (a root URL links to root URLs, an Archiv URL to Archiv
URLs). Mounted **three** times:

1. Around the running championship's own index alone — kept outside the
   season chrome, since "/" keeps the site's own identity.
2. Around the running championship's Tabelle/Verlauf — inside the chrome.
3. Around all three archived views together — inside the archiv chrome. An
   archived championship's index has no competing identity to protect, so
   nothing needs to be carved out there the way `/` is.

Two rules that took iteration to land on, both the user's correction over an
initial version that showed them everywhere uniformly:

- **`/` itself renders without the tab row.** It already has the header nav
  and the switcher to get anywhere else — the trio would be pure repetition
  there, not a second way to the same places.
- **Only `/` gets the rich "Haus23 / Tipprunde / name / switcher" identity
  block.** Every other Übersicht/Tabelle/Verlauf view — including the running
  championship's own Tabelle/Verlauf — gets the same plain name heading an
  archived view does, so the heading looks uniform wherever the trio is
  actually a two-way street between three views.

## Switcher: fixed footer, not a filtered `MenuItem`

`ChampionshipSwitcher` moved out of `championship/index.tsx` (shown on both
branches before) into `_overview-nav.tsx`, root-only — the Archiv overview no
longer needs it, since the season chrome's own link plus the trio's own
Übersicht tab already cover getting around.

Its "Alle Turniere" entry (renamed **"Archiv | Ewige Tabelle"**, to match the
season-chrome's own "Archiv" wording and name the all-time table explicitly)
moved from a `MenuItem` inside the filtered `Autocomplete` collection to a
fixed footer below it, mirroring the already-pinned `SearchField` above:
inside the collection it disappeared on any search that didn't match its own
text, and — once the list is long — could scroll out of reach even
unfiltered. A fixed row can do neither.

Popover placement is responsive, not fixed to `"bottom"`: a short landscape
viewport (a phone on its side) leaves `"bottom"` and its auto-flip to `"top"`
almost no room, down to one or two visible entries. `"end"` (opens sideways)
is the fix there, but only there — used as the default everywhere it visibly
recentres on the trigger as the filtered list's length changes, which reads
worse than `"bottom"` simply growing or shrinking from a fixed top edge. The
`"end"` case additionally gets a **fixed** height (not just capped), so
filtering down to one result doesn't creep the box up and back down on every
keystroke.

## What's still open

Tracked in `docs/backlog.md`, not here — both wait for a later feature
branch:

- Wins column in the all-time table.
- Per-player results view (`archiv/spieler/:playerSlug?` — the URL question
  this doc's route shape already resolves).
