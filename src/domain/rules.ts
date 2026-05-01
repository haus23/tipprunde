export const TIP_RULES = [
  {
    value: "drei-zwei-oder-ein-punkt-joker-verdoppelt" as const,
    label: "3, 2 oder 1 Punkt, Joker verdoppelt",
    description:
      "Exaktes Ergebnis: 3 Punkte · Richtige Tordifferenz: 2 Punkte · Richtiger Ausgang: 1 Punkt.",
  },
  {
    value: "drei-oder-ein-punkt-joker-verdoppelt" as const,
    label: "3 oder 1 Punkt, Joker verdoppelt",
    description: "Exaktes Ergebnis: 3 Punkte · Richtiger Ausgang: 1 Punkt.",
  },
];

export type TipRuleId = (typeof TIP_RULES)[number]["value"];

export const JOKER_RULES = [
  {
    value: "einmal-pro-runde" as const,
    label: "Genau einmal pro Runde",
    description:
      "Auf einen Tipp kann ein Joker gesetzt werden. Die Punkte dieses Tipps werden verdoppelt. Pro Runde kann maximal ein Joker gesetzt werden.",
  },
  {
    value: "zwei-pro-turnier" as const,
    label: "Genau zwei im gesamten Turnier",
    description:
      "Auf einen Tipp kann ein Joker gesetzt werden. Die Punkte dieses Tipps werden verdoppelt. Im gesamten Turnier können maximal zwei Joker gesetzt werden.",
  },
];

export type JokerRuleId = (typeof JOKER_RULES)[number]["value"];

export const MATCH_RULES = [
  {
    value: "keine-besonderheiten" as const,
    label: "Keine Besonderheiten",
    description: "",
  },
  {
    value: "alleiniger-treffer-drei-punkte" as const,
    label: "Alleiniger Treffer: 3 Punkte extra",
    description:
      "Wer als Einziger Punkte auf ein Spiel bekommt, erhält zusätzlich 3 Bonuspunkte auf den Tipp. Ein eventueller Joker verdoppelt vorher.",
  },
];

export type MatchRuleId = (typeof MATCH_RULES)[number]["value"];

export const ROUND_RULES = [
  {
    value: "keine-besonderheiten" as const,
    label: "Keine Besonderheiten",
    description: "",
  },
];

export type RoundRuleId = (typeof ROUND_RULES)[number]["value"];

export const EXTRA_QUESTION_RULES = [
  {
    value: "mit-zusatzfragen" as const,
    label: "Mit Zusatzfragen",
    description:
      "Es gibt Zusatzfragen, die bei richtiger Antwort Bonuspunkte einbringen. Die Staffelung wird jeweils zu Turnier-Beginn festgelegt.",
  },
  {
    value: "keine-besonderheiten" as const,
    label: "Keine Zusatzfragen",
    description: "Es gibt keine Zusatzfragen.",
  },
];

export type ExtraQuestionRuleId = (typeof EXTRA_QUESTION_RULES)[number]["value"];

type RuleEntry = { value: string; label: string; description: string };

export const RULE_CATEGORIES: {
  field: "tipRuleId" | "jokerRuleId" | "matchRuleId" | "roundRuleId" | "extraQuestionRuleId";
  label: string;
  rules: RuleEntry[];
}[] = [
  { field: "tipRuleId", label: "Punkte-Regel", rules: TIP_RULES },
  { field: "jokerRuleId", label: "Joker-Regel", rules: JOKER_RULES },
  { field: "matchRuleId", label: "Spiel-Regel", rules: MATCH_RULES },
  { field: "roundRuleId", label: "Runden-Regel", rules: ROUND_RULES },
  { field: "extraQuestionRuleId", label: "Zusatzfragen-Regel", rules: EXTRA_QUESTION_RULES },
];

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
