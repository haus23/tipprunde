export type TipRuleId =
  | "drei-oder-ein-punkt-joker-verdoppelt"
  | "drei-zwei-oder-ein-punkt-joker-verdoppelt";

export type JokerRuleId = "einmal-pro-runde" | "zwei-pro-turnier";

export type MatchRuleId = "keine-besonderheiten" | "alleiniger-treffer-drei-punkte";

export type RoundRuleId = "keine-besonderheiten";

export type ExtraQuestionRuleId = "mit-zusatzfragen" | "keine-zusatzfragen";

export function isJokerFieldDisabled(
  rule: JokerRuleId,
  matchHasJoker: boolean,
  totalJokers: number,
  roundJokers: number,
): boolean {
  if (matchHasJoker) return false;
  switch (rule) {
    case "zwei-pro-turnier":
      return totalJokers >= 2;
    case "einmal-pro-runde":
      return roundJokers >= 1;
    default:
      return true;
  }
}
