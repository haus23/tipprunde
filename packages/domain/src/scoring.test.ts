import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calcGoalDeviation, calcTipPoints } from "./scoring.ts";

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
