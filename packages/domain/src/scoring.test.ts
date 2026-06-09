import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calcBase, calcTipPoints } from "./scoring.ts";

// --- calcTipPoints ---

void describe("calcTipPoints — null/0 distinction", () => {
  const rule = "drei-oder-ein-punkt-joker-verdoppelt" as const;

  void it("null result → null (not yet calculated)", () => {
    assert.equal(calcTipPoints("2:1", null, rule, false, false), null);
  });

  void it("result exists, wrong tip → 0 (calculated, tip was wrong)", () => {
    assert.equal(calcTipPoints("0:2", "2:1", rule, false, false), 0);
  });

  void it("result exists, correct tip → points", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, false, false), 3);
  });

  void it("null tip with null result → null", () => {
    assert.equal(calcTipPoints(null, null, rule, false, false), null);
  });

  void it("null tip with result → 0", () => {
    assert.equal(calcTipPoints(null, "2:1", rule, false, false), 0);
  });

  void it("empty tip with result → 0", () => {
    assert.equal(calcTipPoints("", "2:1", rule, false, false), 0);
  });
});

// --- calcBase ---

void describe("calcBase — drei-zwei-oder-ein-punkt-joker-verdoppelt", () => {
  const rule = "drei-zwei-oder-ein-punkt-joker-verdoppelt" as const;

  void it("null tip → 0 points", () => {
    assert.equal(calcBase(null, "2:1", rule, false, false), 0);
  });

  void it("empty tip → 0 points", () => {
    assert.equal(calcBase("", "2:1", rule, false, false), 0);
  });

  void it("exact result → 3 points", () => {
    assert.equal(calcBase("2:1", "2:1", rule, false, false), 3);
  });

  void it("correct diff → 2 points", () => {
    assert.equal(calcBase("3:2", "2:1", rule, false, false), 2);
  });

  void it("correct outcome → 1 point", () => {
    assert.equal(calcBase("3:1", "2:1", rule, false, false), 1);
  });

  void it("wrong tip → 0 points", () => {
    assert.equal(calcBase("0:2", "2:1", rule, false, false), 0);
  });

  void it("draw: exact result → 3 points", () => {
    assert.equal(calcBase("1:1", "1:1", rule, false, false), 3);
  });

  void it("draw: correct diff (0:0 vs 1:1) → 2 points", () => {
    assert.equal(calcBase("0:0", "1:1", rule, false, false), 2);
  });

  void it("isDoubleRound doubles base points", () => {
    assert.equal(calcBase("2:1", "2:1", rule, true, false), 6);
  });

  void it("joker doubles base points", () => {
    assert.equal(calcBase("2:1", "2:1", rule, false, true), 6);
  });

  void it("joker + isDoubleRound → 4× base points", () => {
    assert.equal(calcBase("2:1", "2:1", rule, true, true), 12);
  });

  void it("0 base points are not multiplied", () => {
    assert.equal(calcBase("0:2", "2:1", rule, true, true), 0);
  });
});

void describe("calcBase — drei-oder-ein-punkt-joker-verdoppelt", () => {
  const rule = "drei-oder-ein-punkt-joker-verdoppelt" as const;

  void it("exact result → 3 points", () => {
    assert.equal(calcBase("2:1", "2:1", rule, false, false), 3);
  });

  void it("correct diff but not exact → 1 point (no 2-point tier)", () => {
    assert.equal(calcBase("3:2", "2:1", rule, false, false), 1);
  });

  void it("correct outcome → 1 point", () => {
    assert.equal(calcBase("3:1", "2:1", rule, false, false), 1);
  });

  void it("wrong tip → 0 points", () => {
    assert.equal(calcBase("0:2", "2:1", rule, false, false), 0);
  });
});
