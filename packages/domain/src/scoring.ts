import { ROUND_RULES, TIP_RULES } from "./rules.ts";

export type TipRuleId = (typeof TIP_RULES)[number]["value"];
export type RoundRuleId = (typeof ROUND_RULES)[number]["value"];

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
  extraJoker: boolean | null = null,
): number | null {
  if (!result || !tip) return null;

  const [tipHome, tipAway] = parseScore(tip);
  const [resHome, resAway] = parseScore(result);

  let points = 0;

  if (tipHome === resHome && tipAway === resAway) {
    points = 3;
  } else if (
    (tipRuleId === "drei-zwei-oder-ein-punkt" ||
      tipRuleId === "drei-zwei-oder-ein-punkt-unentschieden-besonders") &&
    tipHome - tipAway === resHome - resAway
  ) {
    // Special draw rule: drawn tip on drawn result only scores 2 if within 1 goal per team
    const drawPenalty =
      tipRuleId === "drei-zwei-oder-ein-punkt-unentschieden-besonders" &&
      resHome === resAway &&
      Math.abs(tipHome - resHome) > 1;
    points = drawPenalty ? 1 : 2;
  } else if (signOf(tipHome - tipAway) === signOf(resHome - resAway)) {
    points = 1;
  }

  if (isDoubleRound) points *= 2;
  if (joker) points *= 2;
  if (extraJoker) points *= 2;

  return points;
}

/**
 * Absolute goal deviation for one tip vs. the actual result.
 * A null/missing tip is treated as 0:0.
 */
export function calcGoalDeviation(tip: string | null, result: string): number {
  const [resHome, resAway] = parseScore(result);
  const [tipHome, tipAway] = tip ? parseScore(tip) : [0, 0];
  return Math.abs(resHome - tipHome) + Math.abs(resAway - tipAway);
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
 * Not yet implemented here — "torabweichung-bonus-malus" is the one live
 * roundRuleId today, but its logic lives inline in the manager route that
 * handles "Runde abschließen", not in this package.
 */
export function applyRoundRule(): void {}

/**
 * Whether a round needs the "Abgeschlossen" toggle at all — true for every
 * round rule that only evaluates once the whole round is scored, false for
 * "keine-besonderheiten" and for rounds a round rule doesn't reach yet (the
 * first two rounds under "...-ab-runde-3").
 */
export function isRoundCompletable(roundRuleId: RoundRuleId | undefined, roundNr: number): boolean {
  switch (roundRuleId) {
    case "torabweichung-bonus-malus":
    case "niedrigste-spielsumme-doppelte-punkte":
      return true;
    case "niedrigste-spielsumme-doppelte-punkte-ab-runde-3":
      return roundNr >= 3;
    default:
      return false;
  }
}

/**
 * Select which matches in a round qualify for the lowest-match-sum round
 * rules ("niedrigste-spielsumme-doppelte-punkte[-ab-runde-3]"). Given each
 * match's tip points summed across all players, picks the match(es) with
 * the lowest sum greater than 0 — a tie qualifies every tied match; if
 * every match in the round summed to 0, nothing qualifies.
 *
 * Both rule variants share this selection; only the starting round differs,
 * decided by the caller before it ever calls this — this function has no
 * notion of "round 3".
 *
 * Historical rule text (Hinrunde 2004/05, introduced round 3 onward): "Die
 * Punkte des Spieles, bei dem die wenigsten Punkte (alle Tipper
 * zusammengerechnet) erzielt werden, werden verdoppelt."
 *
 * Known flaw the rule carried for years, later fixed by a separate
 * "lonelyHit" match rule: a single player's lone correct exact-score tip (3
 * points, sum 3) can lose out to two players each landing 1 point on a
 * different match (sum 2) — the rule only ever looks at the sum, never at
 * how many players contributed to it.
 */
export function selectLowestSumMatches(
  matches: { matchId: number; tipPointSum: number }[],
): number[] {
  const nonZero = matches.filter((m) => m.tipPointSum > 0);
  if (nonZero.length === 0) return [];

  const lowestSum = Math.min(...nonZero.map((m) => m.tipPointSum));
  return nonZero.filter((m) => m.tipPointSum === lowestSum).map((m) => m.matchId);
}
