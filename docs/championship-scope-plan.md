# Championship Scope — Public Routing Plan

**Status: designed, not started (2026-08-17).** No code written. Supersedes the
routing parts of [archiv.md](./archiv.md) once adopted; that doc's data design
(materialized ranking columns) is unaffected either way.

## The problem

The Archiv needs feature parity with the current-season views: at least
Zusatzfragen and Spieler-Tipps, realistically Spiele too. Under today's model
that means duplicating five view routes into a second route tree.

The duplication isn't incidental — it falls out of how "Archiv" is modelled.

## The reframe: a dimension, not a place

Today the public site has **two parallel worlds**:

|         | current championship               | Archiv                                     |
| ------- | ---------------------------------- | ------------------------------------------ |
| routes  | `/tabelle`, `/spiele`, `/tipps`, … | `/archiv/:slug`, `/archiv/:slug/regelwerk` |
| layout  | `_championship-layout.tsx`         | `archiv/_layout.tsx`                       |
| context | `publicChampionshipContext`        | `archivChampionshipContext`                |
| source  | latest `published`                 | by slug, `completed`                       |

But these are the _same views_ differing only in **which championship** they
scope to. "Archiv" is a filter over a dimension, not a section of the site.

Two independent precedents already model it that way:

- **The legacy app** (`runde.tips`, still live) had no "Archiv" at all. Every
  championship was viewable through the same views; you switched via a
  championship switcher.
- **This repo's own manager** does exactly this: `/manager/:slug/…` plus
  `routes/manager/_championship-switcher.tsx`.

The public site is the outlier. That is why parity feels like duplication —
under the current model it _is_ duplication.

## Content classification

Sorting the public content by how it is actually used drives most of the
layout decisions below:

| Class                  | Content                        | Usage pattern                                                                             |
| ---------------------- | ------------------------------ | ----------------------------------------------------------------------------------------- |
| **Primary**            | Tabelle, Spiele, Spieler-Tipps | Repeated, routine — earns header nav                                                      |
| **Secondary**          | Regelwerk, Zusatzfragen        | Occasional reference; Zusatzfragen spikes at round end because it moves the final ranking |
| **Cross-championship** | Archiv list, Ewige Tabelle     | Navigational — belongs to season switching, not to any one season                         |

The header nav stays at its three primary items. **No new header entry** — a
firm constraint, and the classification supports it.

## The dashboard is already a championship overview

The current dashboard was built as "the home page", partly as a place to put
secondary content. But three of its four sections are already pure
championship views — and two of them **already handle a completed season**:

```
standings.tsx:24        {completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}
current-matches.tsx:17  {completed ? "Letzte Spiele"    : "Aktuelle Spiele"}
```

Those components were written to work for a finished championship; they simply
were never mounted that way. The Regelwerk section is championship-specific by
nature.

The one section that does _not_ belong is the **Archiv preview** — the only
cross-championship content on the page, and the one added last. The dashboard
does not have a concept problem; it has one section too many.

**Decision: the dashboard is the championship overview**, and every
championship has one:

```
/              → overview of the running championship
/archiv/:slug  → overview of that championship
```

Same component, different scope. The Archiv detail page gains a real overview
instead of only a final table, and the shared index falls out for free.

## Proposed route shape

One championship-scoped subtree, mounted at two entry points:

```ts
// routes.ts
const championshipViews = (id: string) => [
  index("routes/public/championship/index.tsx",                 { id: `${id}-index` }),
  route("tabelle",      "routes/public/championship/tabelle.tsx",      { id: `${id}-tabelle` }),
  route("spiele",       "routes/public/championship/spiele/index.tsx", { id: `${id}-spiele` }),
  route("spiele/:nr",   "routes/public/championship/spiele/detail.tsx",{ id: `${id}-match` }),
  route("tipps/:slug?", "routes/public/championship/tipps/index.tsx",  { id: `${id}-tipps` }),
  route("zusatzfragen", "routes/public/championship/zusatzfragen.tsx", { id: `${id}-zf` }),
  route("regelwerk",    "routes/public/championship/regelwerk.tsx",    { id: `${id}-rw` }),
];

layout("routes/public/_championship-layout.tsx", championshipViews("current")),

route("archiv", "routes/public/archiv/index.tsx"),
route("archiv/:slug", "routes/public/archiv/_layout.tsx", championshipViews("archiv")),
```

**Mechanism (verified against RR8 8.3.0 types):** `route()`, `index()` and
`layout()` all accept an options object carrying `id`, and
`RouteConfigEntry.id` is optional/overridable. The same file can therefore be
mounted twice under different ids — one implementation, two URL branches.

The child route files are **identical between branches**: they read the
championship from context and never know which branch rendered them. A new
public feature is one file, automatically available in both worlds.

Only the two **layouts** differ, which is exactly what they are for: the
current branch carries the "Haus23 / Tipprunde" branding header, the archive
branch carries the back-link, season title, prev/next and the switcher.

## Context merge

The two contexts collapse into one:

```ts
// lib/context.ts — replaces publicChampionshipContext + archivChampionshipContext
export const viewedChampionshipContext = createContext<Championship>();
```

Each branch layout resolves it from its own source and guarantees non-null:

- `_championship-layout.tsx` → latest `published`; renders the "Kein aktives
  Turnier" empty state itself when there is none, so children never see null.
- `archiv/_layout.tsx` → by slug; already 404s on miss (from the loader, not
  middleware — see the RR8 trap in `apps/web/CLAUDE.md`).

Children lose their null-handling branches entirely.

## Visibility rule

Today there are two rules: public = `published`, Archiv = `completed`.
Unified, there is one:

> **`published: true` decides public visibility. `completed` is orthogonal** —
> it means "finished", which drives final-table framing, Ewige-Tabelle
> inclusion and the lock state. It does not grant or deny visibility.

Checked against the dev DB (2026-08-17): all 5 championships are `published`;
4 of those are also `completed`. So `completed ⊆ published` holds in current
data — but **the schema does not enforce it**, so the rule above must be
applied explicitly in the queries rather than assumed.

"Current championship" stays _latest published_, which today happens to be the
only non-completed one. That coincidence should not be relied on either.

## Navigation model

The loop in and out of the archive, without adding a header entry:

- **Into a past season** — the championship switcher on the season title, or
  "Alle Turniere →" from it to `/archiv` (full list + Ewige Tabelle) and pick
  one there.
- **Within a season** — the normal header nav (Tabelle · Spieler · Spiele),
  whose links point into whichever championship is in scope, exactly as the
  manager sidebar does for `/manager/:slug/…`. Plus prev/next on the title for
  sequential browsing.
- **Back out** — the switcher (pick the running season) or the logo/home link.

Consequences:

- The **Archiv sub-nav is deleted** (`archiv/_nav.tsx`). It existed only
  because the archive had no other navigation; the header nav replaces it.
  This also retires the question of whether five sub-nav items fit on mobile —
  they never need to.
- The **Archiv preview leaves the overview** and becomes part of the switcher,
  where cross-championship navigation belongs.
- Mobile navigation is unchanged: three items, as today.

The switcher lives on the season title, not in the app header — the header has
no room to spare next to the planned docked chat panel
(see [web-shell.md](./web-shell.md)).

## Secondary content: routes, not modals

Regelwerk and Zusatzfragen are secondary, but they stay **addressable routes**
rather than popovers or modals. Three reasons:

1. **The chat makes linkability load-bearing.** Zusatzfragen are asked about
   verbally near the end of a round, precisely because they can still move the
   final ranking — and an in-app chat is planned
   ([chat-plan.md](./chat-plan.md)). "It's here: …" is an answer in chat; modal
   content is not linkable, bookmarkable, or titled.
2. **The missing ruleset was the legacy app's known shortcoming.** Burying it
   in a modal would partly re-create the problem being fixed.
3. Secondary means **not prominent**, not **not addressable**. Both are
   satisfied by: own route (addressable) reached from the overview rather than
   the header nav (not prominent).

**Additional entry point for Zusatzfragen:** the ranking table already has a
Zusatzpunkte column (`showExtras`). That column is where the question "how did
those come about?" actually arises — at the final reckoning, exactly the moment
described above. A link from that column header meets the demand where it
occurs. Complementary to the overview entry, not a replacement.

## Migration steps

Mechanical, but touches many files:

1. Move the shared views into `routes/public/championship/`: `tabelle.tsx`,
   `spiele/{index,detail}.tsx`, `tipps/index.tsx`, `zusatzfragen/index.tsx`,
   and `regelwerk.tsx` (from `archiv/`). The current championship gains a
   `/regelwerk` route as a side effect.
2. Turn `public/index.tsx` into the shared championship overview: drop the
   Archiv-preview section, move the "Haus23 / Tipprunde" branding header up
   into `_championship-layout.tsx`.
3. Merge the two contexts into `viewedChampionshipContext`; make both layouts
   guarantee non-null; drop the null branches in the children.
4. Delete `archiv/_nav.tsx` and `archiv/tabelle.tsx` (absorbed by the shared
   views); keep `archiv/_layout.tsx` for the season chrome.
5. Rewrite `routes.ts` with the shared-children helper above.
6. Point the header nav at the in-scope championship (`useMatches` or a context
   value for the URL prefix).
7. Build the switcher on the season title, including "Alle Turniere →".
8. Fold `getArchivChampionshipBySlug` / `getPublishedChampionship` onto the
   single visibility rule. `archiv.server.ts` keeps only the genuinely
   archive-wide queries (`getEwigeTabelle`, `getAllCompletedChampionships`);
   `getArchivPreview` moves to the switcher or retires.
9. Verify the route tree with `react-router routes` diffed before/after by
   resolved URL — the method used for the 2026-08-10 routes restructure (a text
   diff is useless once ordering changes).

## Timing

The app is **not live** — only `next.runde.tips`; real production is still the
legacy stack (see [railway-plan.md](./railway-plan.md)). URL churn therefore
costs nothing today. After the cutover this becomes a real migration with real
URLs to preserve. **This is the cheapest moment for this change.**

## Alternatives considered

- **Expand the Archiv sub-nav** (keep two trees). Solves the symptom, cements
  the duplication: every future public feature is built and wired twice.
  Rejected on long-run cost, not on effort today.
- **Near-fullscreen sheet for the Archiv.** Highest cost, and it weakens deep
  linking (a season's table should be a shareable URL). The chat placement
  question comes on top. Rejected.
- **Own layout for the Archiv with the header nav pointing into it.** Close to
  this plan in spirit — the difference that matters is _sharing the route files
  rather than copying them_, which is what makes parity free.
- **Regelwerk/Zusatzfragen in a popover or modal.** Rejected — see "Secondary
  content" above.

## Decisions taken

| Question                                           | Decision                                                                           |
| -------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `/tipps` default in a season the user never played | Rank 1, as today                                                                   |
| Overview page for archived seasons?                | Yes — the overview _is_ the shared index, not the final table                      |
| `/regelwerk` in the header nav?                    | Never. Reached from the overview                                                   |
| Regelwerk/Zusatzfragen as modal?                   | No — addressable routes, see above                                                 |
| How to reach the archive without a nav entry?      | Championship switcher on the season title, plus `/archiv` behind "Alle Turniere →" |
