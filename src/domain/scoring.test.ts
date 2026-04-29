import { describe, expect, it } from "vitest";

import { scoreTip } from "./scoring.ts";

describe("scoreTip", () => {
  describe("keine Wertung ohne Ergebnis oder Tipp", () => {
    it("gibt 0 zurück wenn kein Spielergebnis vorliegt", () => {
      expect(scoreTip(null, "2:1", false, "drei-oder-ein-punkt-joker-verdoppelt")).toBe(0);
    });

    it("gibt 0 zurück wenn kein Tipp vorliegt", () => {
      expect(scoreTip("2:1", null, false, "drei-oder-ein-punkt-joker-verdoppelt")).toBe(0);
    });
  });

  describe("drei-oder-ein-punkt-joker-verdoppelt", () => {
    const rule = "drei-oder-ein-punkt-joker-verdoppelt" as const;

    it("gibt 3 Punkte für genaues Ergebnis (Heimsieg)", () => {
      expect(scoreTip("2:1", "2:1", false, rule)).toBe(3);
    });

    it("gibt 3 Punkte für genaues Ergebnis (Unentschieden)", () => {
      expect(scoreTip("1:1", "1:1", false, rule)).toBe(3);
    });

    it("gibt 3 Punkte für genaues Ergebnis (Auswärtssieg)", () => {
      expect(scoreTip("0:2", "0:2", false, rule)).toBe(3);
    });

    it("gibt 1 Punkt für korrekte Tendenz (Heimsieg)", () => {
      expect(scoreTip("3:1", "1:0", false, rule)).toBe(1);
    });

    it("gibt 1 Punkt für korrekte Tendenz (Unentschieden)", () => {
      expect(scoreTip("0:0", "1:1", false, rule)).toBe(1);
    });

    it("gibt 1 Punkt für korrekte Tendenz (Auswärtssieg)", () => {
      expect(scoreTip("0:2", "1:3", false, rule)).toBe(1);
    });

    it("gibt 0 Punkte für falsche Tendenz", () => {
      expect(scoreTip("2:1", "0:1", false, rule)).toBe(0);
    });

    it("verdoppelt Punkte bei Joker (genaues Ergebnis)", () => {
      expect(scoreTip("2:1", "2:1", true, rule)).toBe(6);
    });

    it("verdoppelt Punkte bei Joker (Tendenz)", () => {
      expect(scoreTip("2:1", "1:0", true, rule)).toBe(2);
    });

    it("gibt 0 Punkte bei Joker und falscher Tendenz", () => {
      expect(scoreTip("2:1", "0:1", true, rule)).toBe(0);
    });
  });

  describe("drei-zwei-oder-ein-punkt-joker-verdoppelt", () => {
    const rule = "drei-zwei-oder-ein-punkt-joker-verdoppelt" as const;

    it("gibt 3 Punkte für genaues Ergebnis (Heimsieg)", () => {
      expect(scoreTip("2:1", "2:1", false, rule)).toBe(3);
    });

    it("gibt 3 Punkte für genaues Ergebnis (Unentschieden)", () => {
      expect(scoreTip("1:1", "1:1", false, rule)).toBe(3);
    });

    it("gibt 3 Punkte für genaues Ergebnis (Auswärtssieg)", () => {
      expect(scoreTip("0:2", "0:2", false, rule)).toBe(3);
    });

    it("gibt 2 Punkte für gleiche Tordifferenz (Heimsieg)", () => {
      expect(scoreTip("3:1", "4:2", false, rule)).toBe(2);
    });

    it("gibt 2 Punkte für gleiche Tordifferenz (Auswärtssieg)", () => {
      expect(scoreTip("1:3", "0:2", false, rule)).toBe(2);
    });

    it("gibt 2 Punkte für gleiche Tordifferenz (Unentschieden)", () => {
      expect(scoreTip("2:2", "1:1", false, rule)).toBe(2);
    });

    it("gibt 1 Punkt für korrekte Tendenz ohne Tordifferenz (Heimsieg)", () => {
      expect(scoreTip("3:0", "1:0", false, rule)).toBe(1);
    });

    it("gibt 1 Punkt für korrekte Tendenz ohne Tordifferenz (Auswärtssieg)", () => {
      expect(scoreTip("0:3", "0:1", false, rule)).toBe(1);
    });

    it("gibt 0 Punkte für falsche Tendenz", () => {
      expect(scoreTip("2:1", "0:1", false, rule)).toBe(0);
    });

    it("verdoppelt Punkte bei Joker (genaues Ergebnis → 6)", () => {
      expect(scoreTip("2:1", "2:1", true, rule)).toBe(6);
    });

    it("verdoppelt Punkte bei Joker (Tordifferenz → 4)", () => {
      expect(scoreTip("3:1", "4:2", true, rule)).toBe(4);
    });

    it("verdoppelt Punkte bei Joker (Tendenz → 2)", () => {
      expect(scoreTip("3:0", "1:0", true, rule)).toBe(2);
    });
  });
});
