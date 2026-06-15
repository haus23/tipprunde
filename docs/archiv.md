# Archiv

Documents the planned Archiv feature for the web app (`apps/web`).

## Status

**Not yet built.** The `/archiv` route exists as a stub in the router (it's in
`routeTree.gen.ts`), but has no real implementation. The Archiv link has been
**removed from the main nav** — entry point is the dashboard section below.

## Planned: Dashboard section (index route)

A new section at the bottom of the dashboard (below Regelwerk) showing a quick
summary of past championships, linking to the full archive.

**Contents:**

- Section heading (e.g. "Frühere Turniere")
- Last ~3 completed championships: championship name + winner name
- "Komplettes Archiv →" link to `/archiv`

**Placement:** Below Regelwerk, inside the `xs:px-6 px-4` content wrapper — same
horizontal padding as the other dashboard sections.

## Open: winner determination

How to get the winner (rank-1 player) for each past championship:

**Option A — on-the-fly via `calcRanking`**
Call the full scoring chain per past championship on demand. Correct by
construction — same logic as the live ranking. But implies loading tips + results
for every past championship just to get one name.

**Option B — persisted field on the championship table**
Store `winnerId` (or `winnerName`) on the `championships` row once the
championship is completed. Zero extra work at read time; requires a write step
when marking a championship as completed. The manager's "Turnier abschließen"
flow (or the flags card) could trigger this.

**Option C — persisted via materialized ranking snapshot**
Store the full final ranking as a JSON blob or separate `championship_ranking`
table. Heavier than needed for just the winner; more useful if we want podium
(top 3) or historical stats.

No decision made yet. Option B is the simplest for just displaying the winner;
Option A avoids schema changes at the cost of a heavier query.

## Full `/archiv` route (future)

Separate, larger work: a route listing all past championships with their winners,
possibly with drill-down into each championship's final standings. Out of scope
until the dashboard section is built and the winner-determination question is
resolved.

## Notes

- "Past championship" = `completed: true` AND not the currently active one —
  order by descending start date.
- The currently active championship context (`/_championship` layout) is pinned
  to the latest published championship; `/archiv` will need its own data loading
  strategy outside that layout.
