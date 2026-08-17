# Archiv

The Archiv surfaces completed championships: a dashboard preview, a full list
with an all-time table, and a final table per championship.

> **Routing superseded by a decided plan (not yet built).** Reaching feature
> parity with the current-season views (Zusatzfragen, Tipps, Spiele) would mean
> duplicating them into a second route tree. Instead, the championship becomes
> a URL dimension so both worlds share route files, and the dashboard becomes
> the shared per-championship overview — including for archived seasons. The
> Archiv sub-nav goes away; the header nav and a season switcher replace it.
> See [championship-scope-plan.md](./championship-scope-plan.md). **The routes
> described below are current-but-superseded**; the data design (materialized
> ranking columns) is unaffected and stays valid.

## Status

**Built** (2026-08, phases C6/C7 of the app merge).

- `/archiv` — "Turniere" (all completed championships with their winners) and
  "Ewige Tabelle" (all-time standings)
- `/archiv/:slug` — one championship's final table
- Dashboard section "Archiv" — the three most recent completed championships,
  plus a "Komplettes Archiv →" link

Both routes live inside the public layout but **outside** the championship
layout, since the Archiv spans all championships rather than the current one.
Queries are in `apps/web/app/lib/archiv.server.ts`: `getArchivPreview`,
`getAllCompletedChampionships`, `getEwigeTabelle`, `getArchivChampionship`.

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
  roundPoints          integer | null   -- sum of roundPoints entries
  total                integer | null   -- tipPoints + extraQuestionPoints + roundPoints
)
```

Every point category that feeds into `total` has its own explicit column.
`total` is technically derivable from the components, but is stored explicitly
so the ranking is always self-consistent — a rank-1 player can never appear to
have fewer points than rank-2 due to a missing category.

Columns are nullable because they have no meaningful value before any results
are scored. The frontend handles nulls; null is not the same as 0 (which means
"scored, but zero points").

New point categories are added as new nullable columns when they arrive.

## Ranking write strategy

Ranking columns in `players` are updated **incrementally after every relevant
write**, not just when a championship is marked completed. `updateRanking()`
lives in `app/lib/ranking.server.ts` and is called from the manager routes:

- Result scored or edited (`ergebnisse`) → re-rank all players
- Tip entered when a result already exists (`tipps`) → re-rank
- `extraQuestionPointsPublished` flipped (championship `index`) → re-rank
- Extra question points assigned (`zusatzfragen`) → re-rank

Consequences, all of which the Archiv relies on:

- Public views are pure display — no aggregation at read time
- Fewer Turso reads per request
- Historical rankings are preserved with no extra work
- One shape serves all three views:
  - **Dashboard preview / Turniere** — `WHERE rank = 1` per championship
  - **Ewige Tabelle** — `SUM(total) GROUP BY userId ORDER BY SUM(total) DESC`
  - **Championship drill-down** — `WHERE championshipId = ?`

Because the ranking is materialized, **a direct DB write that changes results
or tips does not update it**. Always go through the app, or call
`updateRanking()` afterwards.

## Details worth remembering

- "Past championship" = `completed: true`; the dashboard preview additionally
  excludes the currently active one.
- Ties share a rank in both the championship tables and the Ewige Tabelle, and
  the next distinct score skips ahead (6, 6, 8). Repeated ranks render blank
  rather than repeating the number.
- A championship can have several winners; the preview and Turniere list join
  their names.
- The Archiv is deliberately **not** in the header nav — it is reached from the
  dashboard section, as it was in the old app.
