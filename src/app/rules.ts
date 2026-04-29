export type JokerRuleId = "einmal-pro-runde" | "zwei-pro-turnier";

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
