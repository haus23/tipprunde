# Archiv

Documents the planned Archiv feature for the web app (`apps/web`).

## Status

**Not yet built.** The Archiv link has been **removed from the main nav** — entry
will be via a dashboard section once it's built.

## Data design decision

The `players` join table (`championshipId`, `userId`) already has one row per
player per championship — exactly the right shape for carrying ranking results.

**Decision: extend `players` with nullable ranking columns:**

```
players (
  id                   integer PK
  championshipId       → championships.id
  userId               → users.id
  -- result columns (null until first scoring)
  rank                 integer | null
  tipPoints            integer | null   -- sum of tips.points
  extraQuestionPoints  integer | null   -- sum of extraAnswers.points (when published)
  roundPoints          integer | null   -- sum of roundPoints entries (future)
  total                integer | null   -- tipPoints + extraQuestionPoints + roundPoints
)
```

Every point category that feeds into `total` has its own explicit column. `total`
is technically derivable from the components, but is stored explicitly so the
ranking is always self-consistent — a rank-1 player can never appear to have
fewer points than rank-2 due to a missing category.

Columns are nullable because they have no meaningful value before any results
are scored. The frontend handles nulls; null is not the same as 0 (which means
"scored, but zero points").

New point categories (e.g. `roundPoints`) are added as new nullable columns when
the corresponding rule variant arrives — the iterative schema concept holds.

### Why not a separate table

A dedicated `rankings` table would have the same `(championshipId, userId)` key
and same cardinality as `players` — it would be the same entity split across two
tables for no benefit. One row per player per championship is the right shape;
`players` already owns it.

### Why not store only at completion

See "Ranking write strategy" below. Ranking is kept current throughout the
championship, not only written at completion time.

## Ranking write strategy

Ranking columns in `players` are updated **incrementally after every relevant
manager write**, not just when a championship is marked completed.

**Triggers (manager app):**

- Result scored or edited (`ergebnisse` route) → re-rank all players for the championship
- Tip entered when result already exists (`tipps` route) → re-rank
- `extraQuestionPointsPublished` flag flipped → re-rank (extra points now count / stop counting)
- Extra question points assigned (`zusatzfragen` route) → re-rank (if `extraQuestionPointsPublished`)

**Benefits:**

- Web app becomes pure display — no aggregation at read time, no `calcRanking` in the frontend
- Fewer Turso reads per web request
- Historical rankings (completed championships) are naturally preserved with no extra work
- Serves all three future use cases from the same data:
  - **Archiv dashboard** — `WHERE rank = 1` per championship
  - **Ewige Tabelle** — `SUM(total) GROUP BY userId ORDER BY SUM(total) DESC`
  - **Full Archiv drill-down** — `WHERE championshipId = ?`

**Manager refactor plan:**

1. Add `rank`, `tipPoints`, `extraQuestionPoints`, `roundPoints`, `total` columns to `players` in `packages/db/src/schema.ts`; make `rounds.completed` nullable
2. After each write trigger, update all `players` rows for the championship with the recalculated values
3. Update the web app to read ranking directly from `players` instead of aggregating tips

## Planned: Dashboard section (index route)

A new section at the bottom of the dashboard (below Regelwerk) showing a quick
summary of past championships, linking to the full archive.

**Contents:**

- Section heading (e.g. "Frühere Turniere")
- Last ~3 completed championships: championship name + winner name
- "Komplettes Archiv →" link to `/archiv`

**Placement:** Below Regelwerk, inside the `xs:px-6 px-4` content wrapper — same
horizontal padding as the other dashboard sections.

## Full `/archiv` route (future)

A route listing all past championships with their final standings, possibly with
drill-down into each championship's Tabelle. Out of scope until the manager
refactor and dashboard section are built.

## Notes

- "Past championship" = `completed: true` AND not the currently active one —
  order by descending start date.
- The currently active championship context (`/_championship` layout) is pinned
  to the latest published championship; `/archiv` will need its own data loading
  strategy outside that layout.
- "Ewige Tabelle" will live at its own route (TBD); it aggregates `players.total`
  across all championships per user.
