import { describe, expect, it } from "vite-plus/test";

import { computeRanking } from "./ranking.ts";

describe("computeRanking", () => {
  it("returns empty array for no players", () => {
    expect(computeRanking([])).toEqual([]);
  });

  it("assigns rank 1 to a single player", () => {
    expect(computeRanking([{ userId: 1, points: 5 }])).toEqual([{ userId: 1, points: 5, rank: 1 }]);
  });

  it("assigns sequential ranks for all-different points", () => {
    const result = computeRanking([
      { userId: 3, points: 6 },
      { userId: 1, points: 10 },
      { userId: 2, points: 8 },
    ]);
    expect(result).toEqual([
      { userId: 1, points: 10, rank: 1 },
      { userId: 2, points: 8, rank: 2 },
      { userId: 3, points: 6, rank: 3 },
    ]);
  });

  it("assigns rank 1 to all players when points are equal", () => {
    const result = computeRanking([
      { userId: 1, points: 5 },
      { userId: 2, points: 5 },
    ]);
    expect(result).toEqual([
      { userId: 1, points: 5, rank: 1 },
      { userId: 2, points: 5, rank: 1 },
    ]);
  });

  it("skips ranks after a tie (1-2-2-2-5 example from spec)", () => {
    const result = computeRanking([
      { userId: 1, points: 12 },
      { userId: 2, points: 10 },
      { userId: 3, points: 10 },
      { userId: 4, points: 10 },
      { userId: 5, points: 9 },
    ]);
    expect(result).toEqual([
      { userId: 1, points: 12, rank: 1 },
      { userId: 2, points: 10, rank: 2 },
      { userId: 3, points: 10, rank: 2 },
      { userId: 4, points: 10, rank: 2 },
      { userId: 5, points: 9, rank: 5 },
    ]);
  });

  it("handles tie at the top (1-1-3)", () => {
    const result = computeRanking([
      { userId: 1, points: 10 },
      { userId: 2, points: 10 },
      { userId: 3, points: 8 },
    ]);
    expect(result).toEqual([
      { userId: 1, points: 10, rank: 1 },
      { userId: 2, points: 10, rank: 1 },
      { userId: 3, points: 8, rank: 3 },
    ]);
  });

  it("handles tie at the bottom (1-2-2)", () => {
    const result = computeRanking([
      { userId: 1, points: 10 },
      { userId: 2, points: 8 },
      { userId: 3, points: 8 },
    ]);
    expect(result).toEqual([
      { userId: 1, points: 10, rank: 1 },
      { userId: 2, points: 8, rank: 2 },
      { userId: 3, points: 8, rank: 2 },
    ]);
  });

  it("returns result sorted by points descending regardless of input order", () => {
    const result = computeRanking([
      { userId: 3, points: 3 },
      { userId: 1, points: 9 },
      { userId: 2, points: 6 },
    ]);
    expect(result.map((r) => r.userId)).toEqual([1, 2, 3]);
  });
});
