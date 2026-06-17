import { TIP_RULES } from "./rules.ts";

export type TipRuleId = (typeof TIP_RULES)[number]["value"];

// --- Helpers ---

function parseScore(score: string): [number, number] {
  const [home, away] = score.split(":").map(Number);
  return [home, away];
}

function signOf(n: number): -1 | 0 | 1 {
  return n > 0 ? 1 : n < 0 ? -1 : 0;
}

// --- Scoring ---

/**
 * Calculate points for a single tip.
 *
 * Returns null when no result exists yet — meaning "not yet calculated",
 * which is distinct from 0 (result exists, tip was wrong).
 * Returns 0 for a null or empty tip with a valid result.
 */
export function calcTipPoints(
  tip: string | null,
  result: string | null,
  tipRuleId: TipRuleId,
  isDoubleRound: boolean | null,
  joker: boolean | null,
): number | null {
  if (!result || !tip) return null;

  const [tipHome, tipAway] = parseScore(tip);
  const [resHome, resAway] = parseScore(result);

  let points = 0;

  if (tipHome === resHome && tipAway === resAway) {
    points = 3;
  } else if (tipRuleId === "drei-zwei-oder-ein-punkt" && tipHome - tipAway === resHome - resAway) {
    points = 2;
  } else if (signOf(tipHome - tipAway) === signOf(resHome - resAway)) {
    points = 1;
  }

  if (isDoubleRound) points *= 2;
  if (joker) points *= 2;

  return points;
}

/**
 * Apply match-level modifier after all tips for a match are scored.
 * e.g. "alleiniger-treffer-drei-punkte": sole scorer gets +3 bonus.
 *
 * Not yet implemented — will need full tip objects (with userId, flags)
 * and write-back to DB when a non-trivial matchRuleId is introduced.
 */
export function applyMatchRule(): void {}

/**
 * Apply round-level modifier after all tips for a round are scored.
 *
 * Not yet implemented — will need full tip objects AND all match data
 * for the round. No non-trivial roundRuleId exists yet.
 */
export function applyRoundRule(): void {}
