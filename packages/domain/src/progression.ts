// --- Input / Output ---

export type ProgressionInput = {
  /** Enrolled players — every one gets a row, even without a single point. */
  players: { userId: number; name: string }[];
  /**
   * Points a player gained at one step. Steps a player did not score in are
   * simply absent; entries outside the played range are ignored.
   */
  gains: { stepIndex: number; userId: number; points: number }[];
  /** How many leading steps have data. The result covers exactly these. */
  playedSteps: number;
};

export type PlayerProgression = {
  userId: number;
  /**
   * Display row per step, 0-based and **unique** — this drives the y
   * coordinate. Not the rank: tied players must not share a row, or their
   * lines would coincide, which is the whole point of the bump chart.
   */
  positions: number[];
  /** Tie-aware competition rank per step, 1-based. Equal totals share a rank. */
  ranks: number[];
  /** Cumulative total per step. */
  points: number[];
};

// --- Progression ---

/**
 * Turn per-step point gains into a bump-chart series per player: cumulative
 * points, the tie-aware rank, and a unique display row.
 *
 * The display row carries the previous step's row forward as its tie-break,
 * which is what keeps the chart readable. Early on, ranks are mostly
 * tie-break artefacts — a whole field can sit on two or three distinct
 * totals — and breaking those ties by name would make players jump rows for
 * no reason at all. Carrying the previous row forward keeps a player where
 * they were when someone merely catches up to them.
 *
 * Names only seed the very first step, where there is no previous row yet.
 *
 * Returns one entry per input player, in input order.
 *
 * See docs/verlauf-plan.md.
 */
export function calcProgression({
  players,
  gains,
  playedSteps,
}: ProgressionInput): PlayerProgression[] {
  const stepCount = Math.max(0, playedSteps);

  // Bucket by step so each step only walks its own gains.
  const gainsByStep: { userId: number; points: number }[][] = Array.from(
    { length: stepCount },
    () => [],
  );
  for (const gain of gains) {
    if (gain.stepIndex >= 0 && gain.stepIndex < stepCount) {
      gainsByStep[gain.stepIndex]?.push(gain);
    }
  }

  const cumulative = new Map(players.map((p) => [p.userId, 0]));

  // Seed the carry-forward order alphabetically — at step one everyone is on
  // 0 points, so without a seed the first row assignment would follow input
  // order, which is arbitrary.
  const row = new Map(
    players.toSorted((a, b) => a.name.localeCompare(b.name, "de")).map((p, i) => [p.userId, i]),
  );

  const series = new Map<number, PlayerProgression>(
    players.map((p) => [p.userId, { userId: p.userId, positions: [], ranks: [], points: [] }]),
  );

  for (let step = 0; step < stepCount; step++) {
    for (const gain of gainsByStep[step] ?? []) {
      cumulative.set(gain.userId, (cumulative.get(gain.userId) ?? 0) + gain.points);
    }

    const order = players.toSorted((a, b) => {
      const byPoints = (cumulative.get(b.userId) ?? 0) - (cumulative.get(a.userId) ?? 0);
      return byPoints !== 0 ? byPoints : (row.get(a.userId) ?? 0) - (row.get(b.userId) ?? 0);
    });

    let rank = 1;
    order.forEach((player, index) => {
      const points = cumulative.get(player.userId) ?? 0;
      const ahead = index > 0 ? (cumulative.get(order[index - 1]!.userId) ?? 0) : points;
      if (points !== ahead) rank = index + 1;

      row.set(player.userId, index);
      const entry = series.get(player.userId);
      entry?.positions.push(index);
      entry?.ranks.push(rank);
      entry?.points.push(points);
    });
  }

  return players.map(
    (p) => series.get(p.userId) ?? { userId: p.userId, positions: [], ranks: [], points: [] },
  );
}
