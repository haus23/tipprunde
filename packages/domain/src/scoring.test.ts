import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calcTipPoints } from "./scoring.ts";

void describe("calcTipPoints — null/0 distinction", () => {
  const rule = "drei-oder-ein-punkt-joker-verdoppelt" as const;

  void it("null result → null (not yet calculated)", () => {
    assert.equal(calcTipPoints("2:1", null, rule, false, false), null);
  });

  void it("null tip + null result → null", () => {
    assert.equal(calcTipPoints(null, null, rule, false, false), null);
  });

  void it("null tip + result → 0 (result exists, no tip)", () => {
    assert.equal(calcTipPoints(null, "2:1", rule, false, false), 0);
  });

  void it("empty tip + result → 0", () => {
    assert.equal(calcTipPoints("", "2:1", rule, false, false), 0);
  });

  void it("wrong tip → 0 (result exists, tip was wrong)", () => {
    assert.equal(calcTipPoints("0:2", "2:1", rule, false, false), 0);
  });
});

void describe("calcTipPoints — drei-zwei-oder-ein-punkt-joker-verdoppelt", () => {
  const rule = "drei-zwei-oder-ein-punkt-joker-verdoppelt" as const;

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

  void it("joker + isDoubleRound → 4×", () => {
    assert.equal(calcTipPoints("2:1", "2:1", rule, true, true), 12);
  });

  void it("0 points are not multiplied", () => {
    assert.equal(calcTipPoints("0:2", "2:1", rule, true, true), 0);
  });
});

void describe("calcTipPoints — drei-oder-ein-punkt-joker-verdoppelt", () => {
  const rule = "drei-oder-ein-punkt-joker-verdoppelt" as const;

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
