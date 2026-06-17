# Domain Model

Reference for the flags and rule IDs that drive conditional behaviour
across the slugged championship routes.

---

## Championship flags

| Field                          | Type    | Default | Meaning                                                                  |
| ------------------------------ | ------- | ------- | ------------------------------------------------------------------------ |
| `published`                    | boolean | false   | Championship is visible on the public frontend                           |
| `completed`                    | boolean | false   | Championship is finished; locks editing (TBD) and marks ranking as final |
| `extraQuestionPointsPublished` | boolean | false   | Extra-question **points** count toward the ranking + show in the Tabelle |

> **`extraQuestionPointsPublished`** is _solely_ about the ranking: whether
> extra-answer points are added to the standings and the Tabelle's extras column.
> It does **not** gate the Zusatzfragen view. Whether a championship _has_ extra
> questions at all is decided only by
> `ruleset.extraQuestionRuleId === "mit-zusatzfragen"` (domain `hasExtraQuestions`);
> the ranking inclusion is `hasExtraQuestions && extraQuestionPointsPublished`
> (domain `includesExtraQuestions`).

> **`completed` behaviour is open:** It does NOT necessarily lock editing.
> Primary purpose is to trigger a final stat recalculation. Whether certain
> edit operations are blocked when `completed = true` is TBD.

---

## Round flags

| Field           | Type     | Default | Meaning                                                         |
| --------------- | -------- | ------- | --------------------------------------------------------------- |
| `published`     | boolean  | false   | Matches are visible; players may submit tips                    |
| `tipsPublished` | boolean  | false   | All players' tips for the round are publicly visible            |
| `completed`     | boolean  | false   | Round is finalized; see notes below                             |
| `isDoubleRound` | boolean? | null    | Tip points are doubled for this round (see scoring chain below) |

---

## Ruleset rule IDs

### `tipRuleId` — how tips are scored

| Value                                              | Label                                                | Points                                                                                                                                   |
| -------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `drei-zwei-oder-ein-punkt`                         | 3, 2 oder 1 Punkt                                    | Exact result: 3 · Correct diff: 2 · Correct outcome: 1                                                                                   |
| `drei-zwei-oder-ein-punkt-unentschieden-besonders` | 3, 2 oder 1 Punkt, besondere Regel für Unentschieden | Like above, but a drawn tip scores only 2 points when it differs from the drawn result by exactly 1 goal per team; further off → 1 point |
| `drei-oder-ein-punkt`                              | 3 oder 1 Punkt                                       | Exact result: 3 · Correct outcome: 1                                                                                                     |

Joker doubles the tip points in all variants.

### Points storage — null vs. 0

`tips.points` is a **nullable integer**. The two falsy states have distinct meanings:

| Value  | Meaning                                              |
| ------ | ---------------------------------------------------- |
| `null` | Match has no result yet — points not yet calculated  |
| `0`    | Result exists, this tip scored no points (wrong tip) |

When a result is **reset to null**, all tips for that match must have their points
reset to `null` as well — not `0`. This preserves the "not yet calculated" state
and allows the frontend to distinguish between "no result" and "wrong tip".

### Points recalculation — storage

Points are stored as a **single `tips.points` integer** (the final total after all modifiers).
There are no separate columns for base points vs. rule bonuses.

When recalculation is triggered, all affected tips are **reset to their base value first**,
then modifiers are applied on top — a clean two-pass approach that avoids maintaining
partial state across columns.

### Points recalculation — algorithm

```
// Pass 1 — base points for each tip
for each tip on the match:
    tip.points = calcBase(tip, result, tipRuleId, isDoubleRound)

// Pass 2 — match-level modifier (if matchRuleId !== "keine-besonderheiten")
apply matchRuleId over all tips for this match
    e.g. "alleiniger-treffer-drei-punkte": add 3 to the sole scorer's tip

// Pass 3 — round-level modifier (if roundRuleId !== "keine-besonderheiten")
apply roundRuleId over relevant tips for the round
```

### Points recalculation — triggers

Two domain events trigger recalculation:

**A. Match result edited**

1. Run all three passes for **all tips on this match**

**B. Tip edited (match already has a result)**

1. Recalculate base points (pass 1) for **this tip only**
2. If `matchRuleId` or `roundRuleId` is not `"keine-besonderheiten"`: run passes 2 and 3
   over **all tips for the match** — match-level rules (e.g. sole scorer) depend on
   the full set of tip outcomes, so one tip changing can affect others

### Scoring chain (single tip, applied in order)

1. Base points from `tipRuleId` (3 / 2 / 1 or 3 / 1)
2. × 2 if `isDoubleRound`
3. × 2 if joker set on this tip

### Match-level modifier (`matchRuleId`, applied after all tips calculated)

| Value                            | Effect                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| `keine-besonderheiten`           | No modification                                                                    |
| `alleiniger-treffer-drei-punkte` | If exactly one player scored points on this match: add 3 bonus points to their tip |

### Round-level modifier (`roundRuleId`, applied after round completion)

| Value                      | Effect                                                                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `keine-besonderheiten`     | No modification                                                                                            |
| `tordifferenz-bonus-malus` | After round completion: player with lowest accumulated goal deviation gets +1 point; highest gets −1 point |

Maximum possible score per tip: `3 × 2 × 2 + 3 = 15 points`
(exact result, double round, joker, sole scorer bonus).

### `jokerRuleId` — joker availability

| Value                                    | Constraint                                                                                         |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `einmal-pro-runde`                       | Exactly one joker per round                                                                        |
| `zwei-pro-turnier`                       | Exactly two jokers across the whole championship                                                   |
| `zwei-pro-turnier-plus-zwei-zusatzjoker` | Two jokers across the whole championship; up to two additional jokers may be purchased for €1 each |

Affects: tip entry UI (when/how the joker can be set), tip table column.

### `matchRuleId` — match bonus

| Value                            | Effect                                                                |
| -------------------------------- | --------------------------------------------------------------------- |
| `keine-besonderheiten`           | No bonus                                                              |
| `alleiniger-treffer-drei-punkte` | The sole scorer on a match gets +3 bonus points (applied after joker) |

Affects: points calculation in Ergebnisse.

### `roundRuleId`

| Value                      | Effect                                                            |
| -------------------------- | ----------------------------------------------------------------- |
| `keine-besonderheiten`     | No special round logic                                            |
| `tordifferenz-bonus-malus` | Enables round completion toggle; triggers bonus/malus calculation |

### `extraQuestionRuleId`

| Value                  | Effect                                                     |
| ---------------------- | ---------------------------------------------------------- |
| `mit-zusatzfragen`     | Extra questions exist → show Zusatzpunkte tab/route        |
| `keine-besonderheiten` | No extra questions → Zusatzpunkte route shows info message |

---

## Route-level implications (manager app)

### Turnier (index)

Three sections top to bottom:

1. **Flags card** — toggle `published`, `completed`, and (if
   `extraQuestionRuleId === "mit-zusatzfragen"`) `extraQuestionsPublished`

2. **RundenManagement card** — list of all rounds for this championship;
   round flags are togglable inline; "Neue Runde" create button.
   A round should only be marked `published` once its matches are set.
   `isDoubleRound` toggle only shown when `roundRuleId` supports it
   (deferred to ~championship #30).

3. **SpielerManagement** — add/remove `users` from the `players` join table
   for this championship

### Spiele, Tipps, Ergebnisse

All three share a **round selector** in the left slot of the page toolbar
(not a tabbed UI). Selecting a round drives the content below.

- **Spiele** — matches for the selected round (create / edit matches)
- **Tipps** — tip grid for the selected round: players × matches, one cell
  per tip; joker column presence depends on `jokerRuleId`
- **Ergebnisse** — enter home/away goals per match in the selected round;
  points auto-calculated from `tipRuleId` + `matchRuleId` on save;
  `round.completed` handling depends on `roundRuleId` (see notes below)

### Zusatzpunkte

- Only meaningful if `extraQuestionRuleId === "mit-zusatzfragen"`
- Manage extra questions and assign bonus points to players
- `extraQuestionsPublished` on the championship controls frontend visibility

---

## Flag / rule dependencies

These features are **only rendered or enabled** when the associated rule is active.

| Feature                                            | Condition                                                                                             |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `championship.extraQuestionPointsPublished` toggle | `ruleset.extraQuestionRuleId === "mit-zusatzfragen"`                                                  |
| Zusatzfragen route content (non-empty)             | `ruleset.extraQuestionRuleId === "mit-zusatzfragen"`                                                  |
| `round.isDoubleRound` toggle on create             | `ruleset.roundRuleId === "mit-doppelrunden"` _(rule not yet defined — deferred to ~championship #30)_ |

> **Note on `isDoubleRound`:** The flag exists in the DB schema today but the
> toggle UI should not be shown until the corresponding `roundRuleId` value is
> introduced. For all current championships the field remains `null`.

---

## Ranking persistence

The championship ranking is **persisted incrementally** into the `players` join
table rather than calculated on-the-fly at read time. See
[archiv.md](./archiv.md) for the full data design rationale.

**`players` result columns** (all nullable — null = not yet scored):

| Column                | Type            | Meaning                                                                 |
| --------------------- | --------------- | ----------------------------------------------------------------------- |
| `rank`                | integer \| null | Tie-aware rank (shared ranks possible)                                  |
| `tipPoints`           | integer \| null | Sum of `tips.points` for all scored matches                             |
| `extraQuestionPoints` | integer \| null | Sum of `extraAnswers.points` (only when `extraQuestionPointsPublished`) |
| `roundPoints`         | integer \| null | Sum of round bonus points — future; always null for now                 |
| `total`               | integer \| null | Sum of all above — ranking sort key; stored explicitly for consistency  |

New point categories are added as new nullable columns when the corresponding
rule variant arrives.

**Write triggers** — after any of these manager actions, the `players` ranking
columns are updated. "Re-rank" always means **all enrolled players** for the
championship (match-level rules like sole scorer make this unavoidable):

| Action                                                          | What is recalculated                                  | Route              |
| --------------------------------------------------------------- | ----------------------------------------------------- | ------------------ |
| Match result scored or edited                                   | `tipPoints` + `total` + `rank`                        | `ergebnisse`       |
| Tip entered when result already exists                          | `tipPoints` + `total` + `rank`                        | `tipps`            |
| `extraQuestionPointsPublished` toggled `true`                   | `extraQuestionPoints` + `total` + `rank`              | championship index |
| `extraQuestionPointsPublished` toggled `false`                  | `extraQuestionPoints` → `null`, then `total` + `rank` | championship index |
| Extra answer points changed (if `extraQuestionPointsPublished`) | `extraQuestionPoints` + `total` + `rank`              | `zusatzfragen`     |
| Round completed with active ROUND_RULE (future)                 | `roundPoints` + `total` + `rank`                      | rounds             |

The web app reads ranking directly from `players` — no aggregation at read time.

> **Note:** `applyRoundRule` is currently called at the wrong place in the
> codebase (no-op for all existing championships). This will be corrected as
> part of the ranking refactor.

---

## Open design questions

### `round.completed`

**Decision: make nullable.** `null` = no special ROUND_RULE, no explicit
completion point needed. `true` = manager has explicitly completed the round
to trigger a round-level bonus calculation.

- For `roundRuleId === "keine-besonderheiten"` (all current championships):
  the field stays `null` — it has no meaning and is never set.
- For future special `roundRuleId` variants: the manager explicitly toggles it
  in the UI, which triggers `applyRoundRule` and a ranking update.

This requires a schema change: `completed` on `rounds` becomes nullable
(remove `notNull().default(false)`).

### Missing: `roundPoints` table

Round-level bonus points (needed for future special `roundRuleId` variants)
require a dedicated table — not currently in the schema.

Proposed shape:

```
roundPoints (
  roundId  → rounds.id
  userId   → users.id
  points   integer
)
```

**Deferred** until the first championship with a special roundRule is
introduced (~championship #30 in the data backfill).
