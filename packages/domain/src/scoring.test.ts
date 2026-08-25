import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  calcGoalDeviation,
  calcTipPoints,
  isRoundCompletable,
  selectLowestSumMatches,
} from "./scoring.ts";

void describe("calcTipPoints — null/0 distinction", () => {
  const rule = "drei-oder-ein-punkt" as const;

  void it("null tip + null result → null", () => {
    assert.equal(calcTipPoints(null, null, rule, false, false), null);
  });

  void it("null result → null (not yet calculated)", () => {
    assert.equal(calcTipPoints("2:1", null, rule, false, false), null);
  });

  void it("null tip + result → null (result exists, no tip)", () => {
    assert.equal(calcTipPoints(null, "2:1", rule, false, false), null);
  });

  void it("empty tip + result → null (after edit)", () => {
    assert.equal(calcTipPoints("", "2:1", rule, false, false), null);
  });

  void it("tip + empty result → null (after edit)", () => {
    assert.equal(calcTipPoints("2:1", "", rule, false, false), null);
  });

  void it("empty tip + empty result → null (after edit)", () => {
    assert.equal(calcTipPoints("", "", rule, false, false), null);
  });

  void it("wrong tip → 0 (result exists, tip was wrong)", () => {
    assert.equal(calcTipPoints("0:2", "2:1", rule, false, false), 0);
  });
});

void describe("calcTipPoints — drei-zwei-oder-ein-punkt", () => {
  const rule = "drei-zwei-oder-ein-punkt" as const;

  void it("exact result → 3", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, false, false), 3);
  });

  void it("correct diff → 2", () => {
    assert.equal(calcTipPoints("3:2", "2:1", rule, false, false), 2);
  });

  void it("correct outcome → 1", () => {
    assert.equal(calcTipPoints("3:1", "2:1", rule, false, false), 1);
  });

  void it("wrong tip → 0", () => {
    assert.equal(calcTipPoints("0:2", "2:1", rule, false, false), 0);
  });

  void it("draw: exact result → 3", () => {
    assert.equal(calcTipPoints("1:1", "1:1", rule, false, false), 3);
  });

  void it("draw: correct diff (0:0 vs 1:1) → 2", () => {
    assert.equal(calcTipPoints("0:0", "1:1", rule, false, false), 2);
  });

  void it("isDoubleRound doubles points", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, true, false), 6);
  });

  void it("joker doubles points", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, false, true), 6);
  });

  void it("extraJoker doubles points", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, false, false, true), 6);
  });

  void it("joker + isDoubleRound → 4×", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, true, true), 12);
  });

  void it("0 points are not multiplied", () => {
    assert.equal(calcTipPoints("0:2", "2:1", rule, true, true), 0);
  });
});

void describe("calcTipPoints — drei-zwei-oder-ein-punkt-unentschieden-besonders", () => {
  const rule = "drei-zwei-oder-ein-punkt-unentschieden-besonders" as const;

  void it("exact result → 3", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, false, false), 3);
  });

  void it("correct diff (non-draw) → 2", () => {
    assert.equal(calcTipPoints("3:2", "2:1", rule, false, false), 2);
  });

  void it("correct outcome → 1", () => {
    assert.equal(calcTipPoints("3:1", "2:1", rule, false, false), 1);
  });

  void it("draw: exact → 3", () => {
    assert.equal(calcTipPoints("1:1", "1:1", rule, false, false), 3);
  });

  void it("draw: 1 goal apart (0:0 vs 1:1) → 2", () => {
    assert.equal(calcTipPoints("0:0", "1:1", rule, false, false), 2);
  });

  void it("draw: 1 goal apart (2:2 vs 1:1) → 2", () => {
    assert.equal(calcTipPoints("2:2", "1:1", rule, false, false), 2);
  });

  void it("draw: 2 goals apart (3:3 vs 1:1) → 1", () => {
    assert.equal(calcTipPoints("3:3", "1:1", rule, false, false), 1);
  });

  void it("draw: 2 goals apart (0:0 vs 2:2) → 1", () => {
    assert.equal(calcTipPoints("0:0", "2:2", rule, false, false), 1);
  });
});

void describe("calcTipPoints — drei-oder-ein-punkt", () => {
  const rule = "drei-oder-ein-punkt" as const;

  void it("exact result → 3", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, false, false), 3);
  });

  void it("correct diff but not exact → 1 (no 2-point tier)", () => {
    assert.equal(calcTipPoints("3:2", "2:1", rule, false, false), 1);
  });

  void it("correct outcome → 1", () => {
    assert.equal(calcTipPoints("3:1", "2:1", rule, false, false), 1);
  });

  void it("wrong tip → 0", () => {
    assert.equal(calcTipPoints("0:2", "2:1", rule, false, false), 0);
  });
});

void describe("calcGoalDeviation", () => {
  void it("exact tip → 0", () => {
    assert.equal(calcGoalDeviation("2:1", "2:1"), 0);
  });

  void it("off by 1 home goal → 1", () => {
    assert.equal(calcGoalDeviation("1:1", "2:1"), 1);
  });

  void it("off by both goals → sum of abs diffs", () => {
    assert.equal(calcGoalDeviation("0:2", "3:1"), 4); // |3-0| + |1-2| = 3 + 1
  });

  void it("null tip counts as 0:0", () => {
    assert.equal(calcGoalDeviation(null, "2:1"), 3); // |2-0| + |1-0|
  });

  void it("0:0 tip on 0:0 result → 0", () => {
    assert.equal(calcGoalDeviation("0:0", "0:0"), 0);
  });
});

void describe("isRoundCompletable", () => {
  void it("keine-besonderheiten never needs the toggle", () => {
    assert.equal(isRoundCompletable("keine-besonderheiten", 1), false);
    assert.equal(isRoundCompletable("keine-besonderheiten", 10), false);
  });

  void it("undefined roundRuleId never needs the toggle", () => {
    assert.equal(isRoundCompletable(undefined, 1), false);
  });

  void it("torabweichung-bonus-malus needs it from round 1", () => {
    assert.equal(isRoundCompletable("torabweichung-bonus-malus", 1), true);
  });

  void it("niedrigste-spielsumme-doppelte-punkte needs it from round 1", () => {
    assert.equal(isRoundCompletable("niedrigste-spielsumme-doppelte-punkte", 1), true);
  });

  void it("...-ab-runde-3 does not need it before round 3", () => {
    assert.equal(isRoundCompletable("niedrigste-spielsumme-doppelte-punkte-ab-runde-3", 1), false);
    assert.equal(isRoundCompletable("niedrigste-spielsumme-doppelte-punkte-ab-runde-3", 2), false);
  });

  void it("...-ab-runde-3 needs it from round 3 onward", () => {
    assert.equal(isRoundCompletable("niedrigste-spielsumme-doppelte-punkte-ab-runde-3", 3), true);
    assert.equal(isRoundCompletable("niedrigste-spielsumme-doppelte-punkte-ab-runde-3", 4), true);
  });
});

void describe("selectLowestSumMatches", () => {
  void it("single lowest sum wins", () => {
    const matches = [
      { matchId: 1, tipPointSum: 5 },
      { matchId: 2, tipPointSum: 2 },
      { matchId: 3, tipPointSum: 8 },
    ];
    assert.deepEqual(selectLowestSumMatches(matches), [2]);
  });

  void it("a tie at the lowest sum qualifies every tied match", () => {
    const matches = [
      { matchId: 1, tipPointSum: 2 },
      { matchId: 2, tipPointSum: 5 },
      { matchId: 3, tipPointSum: 2 },
    ];
    assert.deepEqual(selectLowestSumMatches(matches), [1, 3]);
  });

  void it("a sum of 0 is excluded, even if it is the lowest", () => {
    const matches = [
      { matchId: 1, tipPointSum: 0 },
      { matchId: 2, tipPointSum: 1 },
      { matchId: 3, tipPointSum: 4 },
    ];
    assert.deepEqual(selectLowestSumMatches(matches), [2]);
  });

  void it("every match at 0 → nothing qualifies", () => {
    const matches = [
      { matchId: 1, tipPointSum: 0 },
      { matchId: 2, tipPointSum: 0 },
    ];
    assert.deepEqual(selectLowestSumMatches(matches), []);
  });

  void it("no matches → nothing qualifies", () => {
    assert.deepEqual(selectLowestSumMatches([]), []);
  });

  // Real data, Turnier 7 (Hinrunde 2004/05) — the case that surfaced the
  // "niedrigste nicht-null" clarification with the user.
  void it("Turnier 7, Runde 3: two matches tied at sum 2, both qualify", () => {
    const matches = [
      { matchId: 101, tipPointSum: 2 },
      { matchId: 102, tipPointSum: 6 },
      { matchId: 103, tipPointSum: 2 },
      { matchId: 104, tipPointSum: 9 },
    ];
    assert.deepEqual(selectLowestSumMatches(matches), [101, 103]);
  });

  void it("Turnier 7, Runde 4: an all-zero match loses to the sum-1 match", () => {
    const matches = [
      { matchId: 201, tipPointSum: 0 }, // all 16 players scored 0 — excluded
      { matchId: 202, tipPointSum: 1 },
      { matchId: 203, tipPointSum: 7 },
    ];
    assert.deepEqual(selectLowestSumMatches(matches), [202]);
  });
});
