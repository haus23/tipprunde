# Punkteverlauf — Bump Chart

**Status: iteration 1 built (2026-08-19).** One chart, one form — deliberately.
Earlier attempts existed in two now-retired codebases (a TanStack Start app
using visx, a Svelte app using LayerChart); neither was ported — see "Why not
port the old one".

Shipped: `calcProgression` in `packages/domain` (unit-tested, and validated
against every championship in the dev DB — the final step reproduces
`players.rank` and `players.total` exactly), `getVerlauf` in
`app/lib/verlauf.server.ts`, and the route plus `_bump-chart.tsx` under
`routes/public/championship/verlauf/`, reached from Tabelle.

Two things the plan did not anticipate, both found by looking at the rendered
output and fixed:

- **Labels must hang off the last _played_ step, not the plot edge.** In a
  running championship the axis reaches into unplayed steps, so edge-anchored
  labels floated in empty space naming nothing.
- **Axis labels collide around special steps** (`RP12`, `RPZP`). Labels are now
  placed with a minimum gap, and a crowded-out `RP` label still leaves its
  column marked by the round divider below.

## Round dividers

A vertical divider marks the end of every round — the round's `RP` column where
it has one, otherwise its last match. It is **not** drawn on the chart's final
step: a line with nothing after it only boxes the chart in.

That single rule covers the cases without a special case each. `hr0304` keeps a
divider on each of its four `RP` columns; championships without a round rule get
the same rhythm off their last matches; and the `ZP` column ends up fenced off
on its left by the preceding round's divider while staying open on the right.

## What this view answers

One question, stated by the user: **how did the ranking evolve over the
season?** Absolute points and gaps are secondary — worth a possible second
view later, not part of iteration 1.

That ordering matters, because it picks the chart form. The obvious
implementation (cumulative points per player over time) answers the secondary
question well and the primary one only implicitly.

## Why a bump chart, not a points chart — the measurement

The deciding factor is not taste, it is how tightly the field bunches. Measured
against the dev DB (2026-08-19), counting **how many distinct cumulative point
values** the players occupy at four checkpoints:

| Championship | Players | Matches | 25% | 50% | 75% | 100% | Largest tie group |
| ------------ | ------- | ------- | --- | --- | --- | ---- | ----------------- |
| hr0203       | 10      | 25      | 5   | 6   | 6   | 8    | 4                 |
| rr0203       | 15      | 49      | 8   | 9   | 11  | 11   | 4                 |
| hr0304       | 16      | 57      | 11  | 10  | 10  | 11   | 4                 |
| rr0304       | 18      | 48      | 10  | 13  | 14  | 13   | 4                 |
| em2004       | 12      | 8 (6)   | 5   | 6   | 9   | 7    | 4                 |

At mid-season, **18 players share 13 distinct values inside a 20-point spread**.
In a cumulative-points chart that means the lines are not merely close — over
long stretches they are _exactly coincident_, and up to four players sit on the
identical value. No amount of color, curve smoothing or opacity fixes that; it
is a property of the data.

A bump chart spreads the same field across N fixed rows: ~22px between
neighbours on a 400px plot instead of ~5px, independent of how tight the points
are. **The user's stated preference and the better rendering choice coincide
here** — which is why iteration 1 is the bump chart.

## The step axis

The x axis is **not** a match-number scale. It is an ordered list of _steps_,
each of which is one of:

| Kind          | Label    | When it exists                                         |
| ------------- | -------- | ------------------------------------------------------ |
| `match`       | match nr | every match of a **published** round                   |
| `roundPoints` | `RP`     | after a round's last match, iff that round has entries |
| `extraPoints` | `ZP`     | once, at the very end, iff extra points are published  |

So a championship with a round rule reads `… 7 · 8 · RP · 9 · 10 · 11 · ZP`.

This resolves the attribution problem cleanly. Round points belong to a round,
so they get a column exactly where they are awarded. Extra-question points have
**no round reference in the schema** (`extraQuestions` hangs off the
championship), so they cannot be distributed over time — they get one final
column instead. The payoff: **the chart ends exactly on the Abschlusstabelle**,
with a visible last reshuffle, rather than contradicting it.

Measured expectations, so nobody is surprised:

- `RP` exists only in **hr0304** (the only `torabweichung-bonus-malus` ruleset),
  there in all four rounds, and only ever `+1`/`−1` for 2–3 players. It is
  honest and cheap, but visually almost nothing.
- `ZP` is the significant one: 4 of 5 championships have `mit-zusatzfragen`, and
  extras run 5–10 points against totals of 55–63 — clearly rank-relevant.

**Unplayed matches still get their step.** The axis is built from all matches of
published rounds, so it stays stable as the season progresses and shows how far
along it is. Lines simply stop after the last played step.

## Ties: display position vs. true rank

The ranking table deliberately shows shared ranks (`1, 1, 3` — see
`sharesRankAbove` in `components/ranking-table.tsx`). A bump chart cannot: two
players on the same row means overlapping lines, which is the exact problem the
form was chosen to avoid — and the largest tie group is **4 players in every
championship measured**.

So the chart carries two different numbers:

- **display position** — unique per player per step, drives the y coordinate
- **rank** — the real, tie-aware competition rank, shown in the tooltip
  ("Rang 1, punktgleich mit Olli")

Sort order for the display position:

```
1. points        desc
2. previous step's display position  asc
3. name          asc      (seed for the first step)
```

Criterion 2 is load-bearing, not cosmetic: it damps the noise. Early on the
ranks are mostly tie-break artefacts (after two matches, 12 players occupy 5
distinct values) — carrying the previous position forward keeps a player in
their row when they get tied, instead of letting them jump alphabetically.

## Layers, not a palette

`packages/theme` is strictly Radix Sand + a single Orange accent. There is no
categorical palette, and for 10–18 series there should not be one — cycling a
fixed set of hues (the old visx component cycled 12 colors for up to 18 players)
means two players share a color, which destroys the one job the color had.

Three layers instead, all expressible in existing tokens:

| Layer         | Who                               | Treatment                       |
| ------------- | --------------------------------- | ------------------------------- |
| **Focus**     | resolved player (see Route below) | accent stroke, thickest, on top |
| **Reference** | the leader / eventual winner      | app-ink stroke, medium          |
| **Context**   | everyone else                     | muted stroke, thin, low opacity |

Identity never rests on color alone: on wide screens each line is **directly
labeled at its right edge** with the player's name, which also serves as the
legend and (per Interaction below) the tap target.

## Where the code lives

Three layers, matching how scoring/ranking is already split:

**`packages/domain/src/progression.ts`** — pure, unit-tested (the package
already runs `node --experimental-strip-types --test src/*.test.ts`). This is
where the tricky part lives: accumulation, tie-break, position assignment.

```ts
export type Step =
  | { kind: "match"; nr: number }
  | { kind: "roundPoints"; roundNr: number }
  | { kind: "extraPoints" };

export type ProgressionInput = {
  players: { userId: number; name: string }[];
  steps: Step[];
  /** Points gained per player at a given step index. */
  gains: { stepIndex: number; userId: number; points: number }[];
  /** Steps at or beyond this index have no data yet. */
  playedSteps: number;
};

export type PlayerProgression = {
  userId: number;
  /** One entry per played step — parallel arrays keep the payload small. */
  positions: number[]; // 0-based display row, unique per step
  ranks: number[]; // tie-aware competition rank
  points: number[]; // cumulative total
};
```

**`apps/web/app/lib/verlauf.server.ts`** — the DB touchpoint: published rounds
and their matches, tips, round points, extra answers; builds `steps` + `gains`
and calls `calcProgression`. Reuses `hasExtraQuestions` /
`includesExtraQuestions` from `@tipprunde/domain/ranking` rather than
re-deriving the gate.

**`apps/web/app/routes/public/championship/verlauf/`** — `index.tsx` (route) and
a co-located `_bump-chart.tsx`, per the app convention that single-route
components live beside the route with an `_` prefix. The chart is domain-shaped
(players, ranks), so it does **not** belong in `@tipprunde/ui`.

### One documented architecture exception

`docs/archiv.md` states the principle: _"Public views are pure display — no
aggregation at read time."_ This view **must** aggregate at read time — the
materialized `players` columns only hold end-of-championship totals, never a
per-step history.

That is accepted deliberately, not overlooked. The largest championship measured
is 891 tip rows; the whole input is a handful of indexed queries and the
accumulation is O(steps × players) ≈ 1000 operations. Materializing per-step
snapshots would mean a new table and a write-path change for a read-rare view —
far more expensive than the thing it saves.

## Route & navigation

```ts
route("verlauf/:playerSlug?", "routes/public/championship/verlauf/index.tsx",
  { id: `${id}-verlauf` }),
```

Added to `championshipViews()` in `routes.ts`, so it mounts **twice** — the
running championship at `/verlauf` and every archived one at
`/archiv/:slug/verlauf` — with no extra work. That also settles the "archive
only?" question: it is available in both by construction.

`:playerSlug?` mirrors `/tipps/:playerSlug?` and makes a specific player's run
linkable ("schau dir an, wie ich ab Spiel 30 abgestürzt bin") — the same
argument `05-championship-scope.md` makes for keeping secondary content
addressable rather than modal, with the planned chat in mind.

Focus resolution reuses `resolvePlayer()`: explicit slug → logged-in user →
rank 1.

**No new header entry** — that constraint from `05-championship-scope.md`
stands. Entry point is a switcher on the Tabelle view, the same shape the old
app had:

```
Abschlusstabelle · Verlauf
```

## Rendering & responsiveness

Hand-rolled SVG, no chart dependency. Justification: a chart library earns its
keep on continuous scales, "nice" tick algorithms, stacking and standard forms —
**none of which a bump chart uses**. Its y is `position × rowHeight`, its x is
evenly spaced, and its y axis has no ticks at all. visx would be ~8 packages for
geometry we are not using; TanStack Charts is headless primitives, so the
composition work is identical either way.

- **Height is known server-side** (`players × rowHeight` + margins), so it is
  fixed and there is no layout shift.
- **Width comes from a `ResizeObserver`**; SSR renders at a default width and
  the first client frame re-lays-out horizontally only.
- Straight segments first. Monotone/sigmoid connectors between columns are a
  refinement, and the first thing to drop if they cause trouble.

### Mobile (decided: drop the labels)

At 375px, right-edge labels eat ~70px, leaving ~6px per column across 48 matches
— no line is followable. Below the label breakpoint the direct labels are
**omitted**, which buys back the width; identity then comes from the focus layer
plus the tooltip, and focus is changed via the switcher.

Horizontal scrolling of the plot was considered and is held back deliberately —
the user's call was to see (b) working first before adding it.

## Interaction

- **Pointer/tap anywhere in the plot** → nearest step → crosshair, plus a
  readout carrying: step label, focused player, true rank (incl. "punktgleich
  mit …"), cumulative points, gap to the leader.
- **The readout is a fixed line above the plot, not a floating tooltip.** It
  was one at first, positioned in whichever half the focused line was not, so
  it would never cover the point being read — but the focused line changes
  halves as you scrub, so the readout jumped and had no position the eye could
  learn. Worse, on a landscape phone the chart is taller than the viewport and
  the lower position landed below the fold. It is now sticky under the header,
  so it stays put while you scroll through the lower ranks, and it always shows
  a step (the final one at rest) so its line never empties and shifts the chart.
- **Tap a right-edge label** → focus that player (navigates to
  `/verlauf/:playerSlug`, so the focus is linkable). Labels are ~20px tall, an
  adequate target; the 2px line itself is not.
- **Mobile**, where labels are absent → the `PlayerSwitch` is the focus control
  and needs a prominent placement.

## Accessibility

- The chart gets `role="img"` with a summarising `aria-label`.
- A visually-hidden table gives the **focused player's** per-step rank — bounded
  (≤ ~60 rows), unlike a full N×steps table.
- Keyboard: arrow keys move the crosshair between steps.
- Identity is never color-alone: direct labels on wide screens, tooltip
  everywhere.

## Open for iteration 2

- **The points view**, if it is ever missed — the measurement above says it
  will read worse, but that is a prediction, not a verdict.
- **Rank heatmap** as a third view.
- **Horizontal scrolling on mobile**, held back deliberately until the
  label-dropping version had been used.
- **Curved connectors** between columns; straight segments ship today.
- The first client frame re-lays-out horizontally, because SSR has no width to
  measure. Height is known server-side, so nothing jumps vertically.

## Migration steps

1. `packages/domain/src/progression.ts` + `progression.test.ts` — accumulation,
   tie-break, position assignment. Tests cover: shared ranks, the
   previous-position carry, RP/ZP steps, an unfinished championship.
2. `apps/web/app/lib/verlauf.server.ts` — queries + step construction.
3. Route file and `championshipViews()` registration; verify it resolves under
   both `/verlauf` and `/archiv/:slug/verlauf`.
4. `_bump-chart.tsx` — static rendering first (lines, layers, axis labels,
   right-edge labels). No interaction yet.
5. Interaction: crosshair, tooltip, label tap.
6. Mobile pass: label breakpoint, switcher placement.
7. Accessibility pass: hidden table, keyboard stepping, aria labels.
8. Link from Tabelle; update `apps/web/CLAUDE.md` route list and the docs index
   in `CLAUDE.md`.

## Alternatives considered

- **Cumulative points chart (the old visx view).** Rejected as the primary form
  on the measurement above — coincident lines are inherent to this data. Kept as
  a plausible _second_ view later, deferred out of iteration 1 to see whether it
  is missed at all.
- **Rank heatmap** (rows = players, columns = steps). Genuinely strong for this
  data shape and worth prototyping later; a third view is not iteration 1.
- **True shared ranks on the y axis.** Would reintroduce 4-way line overlap —
  the thing the form was chosen to prevent.
- **Per-round x axis.** Championships have only **4–5 rounds**; that is four
  data points, not a progression. Per match (25–57) is the right granularity.
- **Materialized per-step snapshots.** New table + write-path cost for a
  read-rare view; the read-time aggregation is ~1000 operations.

## Why not port the old one

The retired TanStack app's `punkteverlauf-chart.tsx` works, but three of its
core decisions do not survive contact with this codebase:

1. **Cycled colors** — 12 hues for up to 18 players; players 1 and 13 collide.
2. **Color keyed to final rank** — `sortedPlayers` by closing rank, then index →
   hue. In a running championship a player changes color whenever the standings
   move; color must follow the entity, never its rank.
3. **Tip points only** — round points and extra points ignored, so the chart's
   end contradicts the Abschlusstabelle.

Plus hardcoded hex values against a strict token system. What remains portable
is the accumulate-and-snapshot idea, which is a dozen lines.

## Decisions taken

| Question                    | Decision                                                    |
| --------------------------- | ----------------------------------------------------------- |
| Primary form                | Bump chart (rank evolution)                                 |
| Points chart as second view | Deferred — iteration 1 is one chart                         |
| x axis granularity          | Per match, plus RP / ZP special steps                       |
| Ties                        | Unique display position, true rank in the tooltip           |
| Tie-break order             | points desc → previous position → name                      |
| Round / extra points        | Included, as their own steps; chart ends on the final table |
| Color                       | Three layers in existing tokens; no categorical palette     |
| Library                     | Hand-rolled SVG, no dependency                              |
| Route                       | `verlauf/:playerSlug?`, championship-scoped (both branches) |
| Header nav                  | No new entry — switcher on Tabelle                          |
| Mobile                      | Drop right-edge labels below the breakpoint                 |
| Read-time aggregation       | Accepted, documented exception to `archiv.md`               |
