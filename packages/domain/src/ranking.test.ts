import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  calcRanking,
  hasExtraQuestions,
  includesExtraQuestions,
  type RankingInput,
} from "./ranking.ts";

const base: RankingInput = {
  players: [{ userId: 1 }, { userId: 2 }, { userId: 3 }],
  tips: [],
  extraAnswers: [],
  ruleset: { extraQuestionRuleId: "keine-besonderheiten" },
  championship: { extraQuestionPointsPublished: false },
};

void describe("extra-question predicates", () => {
  void it("hasExtraQuestions depends only on the ruleset, not point publishing", () => {
    assert.equal(hasExtraQuestions({ extraQuestionRuleId: "mit-zusatzfragen" }), true);
    assert.equal(hasExtraQuestions({ extraQuestionRuleId: "keine-besonderheiten" }), false);
  });

  void it("includesExtraQuestions also requires published points", () => {
    const ruleset = { extraQuestionRuleId: "mit-zusatzfragen" };
    assert.equal(includesExtraQuestions(ruleset, { extraQuestionPointsPublished: true }), true);
    assert.equal(includesExtraQuestions(ruleset, { extraQuestionPointsPublished: false }), false);
    assert.equal(
      includesExtraQuestions(
        { extraQuestionRuleId: "keine-besonderheiten" },
        { extraQuestionPointsPublished: true },
      ),
      false,
    );
  });
});

void describe("calcRanking — aggregation", () => {
  void it("sums tip points per player", () => {
    const ranking = calcRanking({
      ...base,
      tips: [
        { userId: 1, points: 3 },
        { userId: 1, points: 2 },
        { userId: 2, points: 1 },
      ],
    });
    assert.equal(ranking.find((e) => e.userId === 1)?.tipPoints, 5);
    assert.equal(ranking.find((e) => e.userId === 2)?.tipPoints, 1);
  });

  void it("includes enrolled players with no tips at 0 points", () => {
    const ranking = calcRanking({ ...base, tips: [{ userId: 1, points: 3 }] });
    const p3 = ranking.find((e) => e.userId === 3);
    assert.equal(p3?.total, 0);
    assert.equal(p3?.rank, 2);
  });

  void it("treats null tip points as 0 (not yet scored)", () => {
    const ranking = calcRanking({
      ...base,
      tips: [
        { userId: 1, points: 3 },
        { userId: 1, points: null },
      ],
    });
    assert.equal(ranking.find((e) => e.userId === 1)?.tipPoints, 3);
  });
});

void describe("calcRanking — extra points gating", () => {
  const withExtras: RankingInput = {
    ...base,
    tips: [{ userId: 1, points: 5 }],
    extraAnswers: [
      { userId: 1, points: 2 },
      { userId: 2, points: 4 },
    ],
  };

  void it("ignores extras when ruleset has no extra questions", () => {
    const ranking = calcRanking({
      ...withExtras,
      ruleset: { extraQuestionRuleId: "keine-besonderheiten" },
      championship: { extraQuestionPointsPublished: true },
    });
    assert.equal(ranking.find((e) => e.userId === 1)?.extraPoints, 0);
    assert.equal(ranking.find((e) => e.userId === 1)?.total, 5);
  });

  void it("ignores extras when championship has not published them", () => {
    const ranking = calcRanking({
      ...withExtras,
      ruleset: { extraQuestionRuleId: "mit-zusatzfragen" },
      championship: { extraQuestionPointsPublished: false },
    });
    assert.equal(ranking.find((e) => e.userId === 1)?.extraPoints, 0);
  });

  void it("adds extras when ruleset includes them and they are published", () => {
    const ranking = calcRanking({
      ...withExtras,
      ruleset: { extraQuestionRuleId: "mit-zusatzfragen" },
      championship: { extraQuestionPointsPublished: true },
    });
    assert.equal(ranking.find((e) => e.userId === 1)?.extraPoints, 2);
    assert.equal(ranking.find((e) => e.userId === 1)?.total, 7);
  });

  void it("supports fractional extra points", () => {
    const ranking = calcRanking({
      ...base,
      extraAnswers: [{ userId: 1, points: 1.5 }],
      ruleset: { extraQuestionRuleId: "mit-zusatzfragen" },
      championship: { extraQuestionPointsPublished: true },
    });
    assert.equal(ranking.find((e) => e.userId === 1)?.total, 1.5);
  });
});

void describe("calcRanking — tie-aware ranks", () => {
  void it("sorts by descending total", () => {
    const ranking = calcRanking({
      ...base,
      tips: [
        { userId: 1, points: 1 },
        { userId: 2, points: 5 },
        { userId: 3, points: 3 },
      ],
    });
    assert.deepEqual(
      ranking.map((e) => e.userId),
      [2, 3, 1],
    );
  });

  void it("equal totals share a rank and the next rank skips", () => {
    const ranking = calcRanking({
      ...base,
      tips: [
        { userId: 1, points: 5 },
        { userId: 2, points: 5 },
        { userId: 3, points: 1 },
      ],
    });
    assert.deepEqual(
      ranking.map((e) => ({ userId: e.userId, rank: e.rank })),
      [
        { userId: 1, rank: 1 },
        { userId: 2, rank: 1 },
        { userId: 3, rank: 3 },
      ],
    );
  });

  void it("all tied at 0 → all rank 1", () => {
    const ranking = calcRanking(base);
    assert.deepEqual(
      ranking.map((e) => e.rank),
      [1, 1, 1],
    );
  });
});
