import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { calcProgression, type ProgressionInput } from "./progression.ts";

/** Anna, Bert, Zoe — deliberately not in alphabetical input order. */
const players: ProgressionInput["players"] = [
  { userId: 3, name: "Zoe" },
  { userId: 1, name: "Anna" },
  { userId: 2, name: "Bert" },
];

const at = (result: ReturnType<typeof calcProgression>, userId: number) => {
  const entry = result.find((e) => e.userId === userId);
  assert.ok(entry, `no series for user ${userId}`);
  return entry;
};

void describe("calcProgression — shape", () => {
  void it("returns one entry per player, in input order", () => {
    const result = calcProgression({ players, gains: [], playedSteps: 2 });
    assert.deepEqual(
      result.map((e) => e.userId),
      [3, 1, 2],
    );
  });

  void it("produces empty series when nothing has been played", () => {
    const result = calcProgression({ players, gains: [], playedSteps: 0 });
    assert.deepEqual(at(result, 1).positions, []);
    assert.deepEqual(at(result, 1).points, []);
  });

  void it("covers exactly the played steps, ignoring gains beyond them", () => {
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 1, points: 3 },
        { stepIndex: 5, userId: 1, points: 99 },
      ],
      playedSteps: 2,
    });
    assert.equal(at(result, 1).points.length, 2);
    assert.deepEqual(at(result, 1).points, [3, 3]);
  });
});

void describe("calcProgression — accumulation", () => {
  void it("accumulates points across steps", () => {
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 1, points: 3 },
        { stepIndex: 1, userId: 1, points: 2 },
        { stepIndex: 2, userId: 1, points: 1 },
      ],
      playedSteps: 3,
    });
    assert.deepEqual(at(result, 1).points, [3, 5, 6]);
  });

  void it("keeps a player without any gains at 0", () => {
    const result = calcProgression({
      players,
      gains: [{ stepIndex: 0, userId: 1, points: 3 }],
      playedSteps: 2,
    });
    assert.deepEqual(at(result, 2).points, [0, 0]);
  });

  void it("applies negative gains — round points are +1/-1", () => {
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 1, points: 5 },
        { stepIndex: 1, userId: 1, points: -1 },
      ],
      playedSteps: 2,
    });
    assert.deepEqual(at(result, 1).points, [5, 4]);
  });

  void it("sums several gains landing on the same step", () => {
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 1, points: 2 },
        { stepIndex: 0, userId: 1, points: 3 },
      ],
      playedSteps: 1,
    });
    assert.deepEqual(at(result, 1).points, [5]);
  });
});

void describe("calcProgression — ranks vs. display rows", () => {
  void it("shares a rank on equal points and skips the next", () => {
    // Anna and Bert on 3, Zoe on 0 → ranks 1, 1, 3.
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 1, points: 3 },
        { stepIndex: 0, userId: 2, points: 3 },
      ],
      playedSteps: 1,
    });
    assert.equal(at(result, 1).ranks[0], 1);
    assert.equal(at(result, 2).ranks[0], 1);
    assert.equal(at(result, 3).ranks[0], 3);
  });

  void it("still gives every player a unique display row when ranks are shared", () => {
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 1, points: 3 },
        { stepIndex: 0, userId: 2, points: 3 },
      ],
      playedSteps: 1,
    });
    const rows = result.map((e) => e.positions[0]);
    assert.deepEqual(rows.toSorted(), [0, 1, 2]);
  });

  void it("orders rows by points, best on row 0", () => {
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 2, points: 5 },
        { stepIndex: 0, userId: 1, points: 1 },
      ],
      playedSteps: 1,
    });
    assert.equal(at(result, 2).positions[0], 0);
    assert.equal(at(result, 1).positions[0], 1);
    assert.equal(at(result, 3).positions[0], 2);
  });
});

void describe("calcProgression — carry-forward tie-break", () => {
  void it("seeds the first step alphabetically, not by input order", () => {
    // Nobody has scored, so the whole field is tied: Anna, Bert, Zoe.
    const result = calcProgression({ players, gains: [], playedSteps: 1 });
    assert.equal(at(result, 1).positions[0], 0); // Anna
    assert.equal(at(result, 2).positions[0], 1); // Bert
    assert.equal(at(result, 3).positions[0], 2); // Zoe
  });

  void it("lets a leader keep their row when someone merely catches up", () => {
    // Zoe leads after step 0; Anna draws level at step 1. Alphabetically Anna
    // would take row 0 — the carry-forward keeps Zoe there instead.
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 3, points: 3 },
        { stepIndex: 1, userId: 1, points: 3 },
      ],
      playedSteps: 2,
    });
    assert.deepEqual(at(result, 3).positions, [0, 0]); // Zoe holds row 0
    assert.equal(at(result, 1).positions[1], 1); // Anna arrives on row 1
    // …while the shared rank is reported honestly.
    assert.equal(at(result, 3).ranks[1], 1);
    assert.equal(at(result, 1).ranks[1], 1);
  });

  void it("moves a player up only when they actually go ahead", () => {
    const result = calcProgression({
      players,
      gains: [
        { stepIndex: 0, userId: 3, points: 3 },
        { stepIndex: 1, userId: 1, points: 4 },
      ],
      playedSteps: 2,
    });
    assert.equal(at(result, 1).positions[1], 0); // Anna overtakes
    assert.equal(at(result, 3).positions[1], 1); // Zoe drops one row
    assert.equal(at(result, 1).ranks[1], 1);
    assert.equal(at(result, 3).ranks[1], 2);
  });
});
