# Domain Model

Reference for the flags and rule IDs that drive conditional behaviour
across the slugged championship routes.

---

## Championship flags

| Field                     | Type    | Default | Meaning                                                         |
| ------------------------- | ------- | ------- | --------------------------------------------------------------- |
| `published`               | boolean | false   | Championship is visible on the public frontend                  |
| `completed`               | boolean | false   | Championship is finished; triggers expensive stat recalculation |
| `extraQuestionsPublished` | boolean | false   | Extra questions for this championship have been published       |

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

| Value                                       | Label             | Points                                                 |
| ------------------------------------------- | ----------------- | ------------------------------------------------------ |
| `drei-zwei-oder-ein-punkt-joker-verdoppelt` | 3, 2 oder 1 Punkt | Exact result: 3 · Correct diff: 2 · Correct outcome: 1 |
| `drei-oder-ein-punkt-joker-verdoppelt`      | 3 oder 1 Punkt    | Exact result: 3 · Correct outcome: 1                   |

Joker doubles the tip points in both variants.

### Scoring chain (applied in order)

1. Base points from `tipRuleId` (3 / 2 / 1 or 3 / 1)
2. × 2 if `isDoubleRound`
3. × 2 if joker set on this tip
4. - 3 if sole scorer (`matchRuleId === "alleiniger-treffer-drei-punkte"`)

Maximum possible score per tip: `3 × 2 × 2 + 3 = 15 points`
(exact result, double round, joker, sole scorer).

### `jokerRuleId` — joker availability

| Value              | Constraint                                       |
| ------------------ | ------------------------------------------------ |
| `einmal-pro-runde` | Exactly one joker per round                      |
| `zwei-pro-turnier` | Exactly two jokers across the whole championship |

Affects: tip entry UI (when/how the joker can be set), tip table column.

### `matchRuleId` — match bonus

| Value                            | Effect                                                                |
| -------------------------------- | --------------------------------------------------------------------- |
| `keine-besonderheiten`           | No bonus                                                              |
| `alleiniger-treffer-drei-punkte` | The sole scorer on a match gets +3 bonus points (applied after joker) |

Affects: points calculation in Ergebnisse.

### `roundRuleId`

| Value                  | Effect                 |
| ---------------------- | ---------------------- |
| `keine-besonderheiten` | No special round logic |

Currently only one variant. A future value (e.g. `mit-doppelrunden`) will
unlock the `isDoubleRound` toggle when creating a round — deferred until the
first championship that uses it (approx. championship #30 in the data backfill).

### `extraQuestionRuleId`

| Value                  | Effect                                                     |
| ---------------------- | ---------------------------------------------------------- |
| `mit-zusatzfragen`     | Extra questions exist → show Zusatzpunkte tab/route        |
| `keine-besonderheiten` | No extra questions → Zusatzpunkte route shows info message |

---

## Route-level implications

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

| Feature                                       | Condition                                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `championship.extraQuestionsPublished` toggle | `ruleset.extraQuestionRuleId === "mit-zusatzfragen"`                                                  |
| Zusatzpunkte route content (non-empty)        | `ruleset.extraQuestionRuleId === "mit-zusatzfragen"`                                                  |
| `round.isDoubleRound` toggle on create        | `ruleset.roundRuleId === "mit-doppelrunden"` _(rule not yet defined — deferred to ~championship #30)_ |

> **Note on `isDoubleRound`:** The flag exists in the DB schema today but the
> toggle UI should not be shown until the corresponding `roundRuleId` value is
> introduced. For all current championships the field remains `null`.

---

## Open design questions

### `round.completed`

This flag has two distinct meanings depending on context:

**Without special `roundRuleId`** (current situation):

- A round can be considered "done" once all match results are entered
- Auto-completing on last result entry is a reasonable strategy
- Cascading from `championship.completed` (mark all rounds completed) is another option

**With a future special `roundRuleId`** (e.g. round-level bonus calculation):

- Explicit setting by the manager is required to trigger a round-level
  calculation that adds bonus points to players
- Auto-completion on last result would be wrong here

**Proposed strategy:**

- For `roundRuleId === "keine-besonderheiten"`: auto-complete when the last
  match result is saved, or cascade from `championship.completed`
- For future special roundRules: expose an explicit toggle in the UI

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
