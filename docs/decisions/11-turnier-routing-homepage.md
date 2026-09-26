# Turnier Routing, a Real Homepage, and the Nachspielzeit

**Status: done (2026-09-27).** Supersedes the route shape from
[10-archiv-navigation.md](./10-archiv-navigation.md) — `/archiv/turnier/:slug`
is replaced by `/turnier/:slug`, and the running championship moves from the
root to `/turnier`. 10's season-chrome and Übersicht/Tabelle/Verlauf rahmen
reasoning are unaffected and stay the reference for those.

## Championships live under `/turnier`, and only there

- `/turnier` — the running championship (latest published)
- `/turnier/:slug` — any published championship, the running one included

Both mount the exact same tree (`championshipTree()` in `routes.ts`): season
chrome around every view, the Übersicht/Tabelle/Verlauf rahmen around those
three. The root-mounted views (`/tabelle`, `/spiele`, `/tipps`, …) are gone —
every view exists once per branch, nowhere else.

Why: a championship's URL used to change the moment it was archived (`/` →
`/archiv/turnier/<slug>`) — exactly the kind of break 05 and 10 both had to
work around. Now `/turnier/<slug>` is final from the day a championship is
published. `/turnier` stays as the short, always-current entry the header
nav falls back to outside any championship.

Two separate `route()` registrations, not one optional `:slug?`: React Router
could not otherwise tell "the running championship's `/turnier/tabelle`"
from "a championship whose slug is `tabelle`". For the same reason a slug may
never equal one of the view segments (`tabelle`, `spiele`, `tipps`,
`verlauf`, `zusatzfragen`, `regelwerk`); real slugs look like `hr0708`.

A major release: `/archiv/turnier/:slug` (live since v2.0.0) and the
root-mounted views 404 now, no redirects — same practice as 10.

## `/` is a homepage, not a championship view

`/` used to _be_ the running championship's overview. It is now the site's
own homepage, built from **modules**:

| Page                           | Modules                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------ |
| `/` (homepage)                 | branding + switcher, standings, current matches, latest from the Nachspielzeit |
| `/turnier[/:slug]` (Übersicht) | standings, current matches, Stadionsenf comment, ruleset                       |

No module framework: the modules are plain components
(`components/championship-standings.tsx`,
`components/championship-current-matches.tsx`, `components/post-list.tsx`,
…), composed differently per page. On the homepage the championship modules
sit in a `ChampionshipScopeProvider basePath="/turnier"`, so their links lead
into the running championship like everywhere else.

## Nachspielzeit — occasional articles, not a blog

A few times a year there is something worth writing up (Regelkunde, the
wildest Zusatzfragen, Wolfgang's odd match picks). These live in
`content/blog/*.md`, listed at `/nachspielzeit` and teased with the latest
three on the homepage. An article's optional `championships: [slug, …]`
frontmatter links forward to those championships.

The name: what comes on top of the actual game, no promise of a regular
schedule — two articles a year feel right under it rather than abandoned. It
pairs with "Stadionsenf", which stays the name of the per-championship
comment (`content/turniere/<slug>.md`) on that championship's own Übersicht
and is _not_ part of the Nachspielzeit list. Rejected alternatives included
"Beiträge" (too plain), "Stammtisch" (reads as discussion rather than
writing) and "Verlängerung" (already a scoring term here — results after 120
minutes). Always singular — "in der Nachspielzeit", never "Nachspielzeiten":
it is a place people refer to, not a collection.

## Navigation: unchanged

The header stays as it was before this change — logo, Tabelle · Spieler ·
Spiele, theme, user — see [web-shell.md](../web-shell.md#navigation). Outside
any championship the three links lead into the running one at `/turnier`.

## Tried and dropped

The branch went through three navigation designs before landing back at the
original header, worth recording so they aren't re-proposed without the
reasons:

- **A two-item site nav (Tipprunde · Stadionsenf) next to the
  championship nav.** Overflowed at 375px and shifted the header between
  sections.
- **Two stacked levels** — a site row plus a sticky championship row naming
  the championship. Solved the overflow, but a desktop Tabelle ended up with
  three navs stacked (site row, championship row, Übersicht/Tabelle/Verlauf).
- **Folding the site row away** behind a disclosure button in the
  championship row. Worked, but needed hover-intent, focus and
  portalled-popover handling — all to reach a blog that gets two articles a
  year.

What dissolved the problem was the content decision, not a nav pattern:
occasional articles don't need a top-level nav slot. A teaser on the
homepage is enough, and with no second section to navigate to, the original
single header works again.
