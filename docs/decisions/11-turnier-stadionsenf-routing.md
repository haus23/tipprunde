# Turnier/Stadionsenf Routing — One Championship-by-Slug Family, One Blog

**Status: done (2026-09-22).** Supersedes the route shape from
[10-archiv-navigation.md](./10-archiv-navigation.md) — `/archiv/turnier/:slug`
is replaced by `/turnier/:slug`. 10's chrome and Übersicht/Tabelle/Verlauf
rahmen reasoning, and its switcher-placement decisions, are unaffected and
stay the reference for those.

## Why this came up: the Blog needed a nav target

Building the Stadionsenf blog meant splitting the header into a two-tier nav
("Tipprunde" / "Stadionsenf") — the existing three-item primary nav
(Tabelle/Spieler/Spiele) had no room to also carry a blog link, and
`web-shell.md` documents that nav as deliberately tight. "Tipprunde" needed
somewhere to point that wasn't one of those three items and wasn't "/" itself
(clicking a top-level nav item to land back where the logo already goes would
be redundant).

## The bigger win found along the way

`/archiv/turnier/:slug` meant a championship's public URL changes the moment
it gets archived (`/` → `/archiv/turnier/<slug>`). That's exactly the kind of
break `05-championship-scope.md` and `10-archiv-navigation.md` both had to
work around. Merging the running-championship views and the by-slug views
into one `/turnier` + `/turnier/:slug` family removes the problem at the
root: every championship gets its forward-looking URL the moment it is
published, current or not — `/turnier/<slug>` never needs to change again
once a season ends.

`/turnier/tabelle` (running championship) and `/turnier/hr0405/tabelle` (any
other published one) are **structurally identical** — same chrome, same
tabs, same view components. `routes.ts` still needs two separate `route()`
registrations rather than one optional `:slug?` parameter, because React
Router cannot otherwise tell "the running championship's `/turnier/tabelle`"
apart from "a championship whose slug happens to be `tabelle`" — that split
is routing plumbing, not a UX difference. A slug is not allowed to collide
with one of the view segments (`tabelle`, `spiele`, `tipps`, `verlauf`,
`zusatzfragen`, `regelwerk`) for the same reason; in practice slugs look like
`hr0708`/`em2008` and never have.

## Stufe 1: `/` stays, `/turnier` duplicates it — on purpose

`/` keeps showing the running championship's Übersicht exactly as before
(branding block, switcher, no chrome bar, no tabs — the `isHome` special case
in `_overview-nav.tsx` is untouched). `/turnier` is a **new, parallel** mount
of the same underlying data, but styled like every other championship view:
chrome bar, tabs, plain heading, no branding, no switcher. This is a
deliberate transitional redundancy, not an oversight — the real homepage
content for `/` (what it should be once it stops needing to double as the
championship overview) is an open question the team doesn't have an answer
to yet. Rather than guess, or block the blog on that decision, `/` and
`/turnier` simply coexist showing the same thing until a real homepage
design exists to replace `/`'s content. "Tipprunde" in the header therefore
points to `/turnier/tabelle`, not bare `/turnier` — landing on the same
Übersicht a second click after the logo already goes there would be circular
for no reason.

## Nav-slot mechanism: pathname regex, not `handle`/`useMatches`, not a Portal

Two mechanisms were considered and rejected for "show the right sub-nav for
the right section":

- **`route.handle` + `useMatches()`**, carrying a component reference the
  parent renders. Doesn't work here: `_layout.tsx` sits _above_
  `ChampionshipScopeProvider` and renders its header directly in its own
  JSX, not through `<Outlet/>`. A `<Nav/>` component placed there would sit
  outside the provider's React tree, and `useScopedPath()` would throw
  "used outside provider" — context depends on tree position, not on where a
  route is declared.
- **A React Portal**, rendering into a header-owned DOM node from deeper in
  the tree. Works, but only after hydration — the portal's target ref
  doesn't exist during SSR, so the primary nav would flash in empty on first
  paint. Not acceptable for navigation that should be in the initial HTML.

What `_layout.tsx` already did — deriving scope from `useLocation().pathname`
via `championshipBasePath()`, a plain regex, no context needed since it runs
above the provider — turned out to be sufficient for both the section split
and the sub-nav. `championshipBasePath()` now returns `string | null`:
`null` outside any championship (`/archiv`, `/stadionsenf`, `/login`, 404),
`""` for `/` and its own views, `/turnier` or `/turnier/<slug>` otherwise.
The header uses `null` to hide the Tabelle/Spieler/Spiele sub-nav entirely,
and explicit boolean checks (not `NavLink`'s own path matching) to highlight
"Tipprunde" across all three in-scope shapes at once.

## Two nav levels, one at a time

A first pass put both levels side by side in one header row (Tipprunde ·
Stadionsenf | Tabelle · Spieler · Spiele). It overflowed at 375px and shifted
the header layout between sections. Replaced by a hierarchy: the site level
and the championship level are never shown next to each other, the logo
always leads one level up, and no hamburger menu. Details and per-breakpoint
behaviour in [web-shell.md](../web-shell.md#navigation).

Two consequences worth recording:

- **The championship row names the championship.** The old header nav's
  "Tabelle" never said _which_ championship's table it meant — it silently
  belonged to the running one. The sticky row from `sm` up carries the name
  on its left, so the nav always reads in context.
- **The season-chrome bar moved into that row** from `sm` up (prev · Archiv ·
  next as icons, full names in `title`), freeing the page from a second
  navigation strip. Below `sm` there is no room in the single bar, so the old
  in-flow bar stays there.

The row lives in `_championship-chrome.tsx`, not the public header: that file
already sits inside the championship scope with the championship and its
neighbours loaded, while `_layout.tsx` sits above the provider and knows
neither.

## Stadionsenf: one brand, two ausschnitte

The new blog (`/stadionsenf`, `/stadionsenf/:slug`, content in
`content/blog/*.md`) uses the same name as the existing per-championship
comment (`content/turniere/<slug>.md`, shown as a "Stadionsenf" section on
every championship's own Übersicht) — deliberately, not a naming collision.
Both are fan commentary; the championship page shows only the one comment
explicitly written for that tournament, `/stadionsenf` shows everything.
Same brand, narrower vs. wider view: `/stadionsenf` reads **both**
directories as one stream (`getBlogPosts()`/`getBlogPost()`), so every
turnier comment is also a blog article under `/stadionsenf/<championship
slug>`, implicitly linked to its own championship. A turnier comment only
appears there once its championship is published — same visibility rule as
the championship itself. Blog posts and turnier comments share the
`/stadionsenf/:slug` namespace, so a blog filename must never equal a
championship slug (blog wins if it does). `getTurnierComment()` stays the
by-slug lookup for the championship overview.

A blog post's optional `championships: [slug, ...]` frontmatter field
produces a forward link only (post → `/turnier/<slug>`) for this iteration —
not the reverse (a championship page listing posts that reference it), which
would mean scanning the whole blog directory on every championship view for
a feature nobody has asked to see there yet.

## What's still open

- The real content for `/` once it stops duplicating `/turnier` — no design
  yet, tracked verbally, not in `docs/backlog.md` until there is a concrete
  next step.
- The Wins column and per-player results view from `docs/backlog.md`,
  unrelated to this change, still on a later feature branch.
