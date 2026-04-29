import type { TipRuleId } from "./rules.ts";

function parse(score: string): [number, number] {
  const [home, away] = score.split(":").map(Number);
  return [home, away];
}

function tendency(home: number, away: number): "home" | "draw" | "away" {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function scoreTip(
  result: string | null,
  tip: string | null,
  joker: boolean,
  tipRuleId: TipRuleId,
): number {
  if (!result || !tip) return 0;

  const [rHome, rAway] = parse(result);
  const [tHome, tAway] = parse(tip);

  let points = 0;

  if (rHome === tHome && rAway === tAway) {
    points = 3;
  } else if (tendency(rHome, rAway) === tendency(tHome, tAway)) {
    if (
      tipRuleId === "drei-zwei-oder-ein-punkt-joker-verdoppelt" &&
      rHome - rAway === tHome - tAway
    ) {
      points = 2;
    } else {
      points = 1;
    }
  }

  return joker ? points * 2 : points;
}
