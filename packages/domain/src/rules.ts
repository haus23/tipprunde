export const TIP_RULES = [
  {
    value: "drei-zwei-oder-ein-punkt-unentschieden-besonders" as const,
    label: "3, 2 oder 1 Punkt, besondere Regel für Unentschieden",
    description:
      "Exaktes Ergebnis: 3 Punkte · Richtige Tordifferenz: 2 Punkte · Richtiger Ausgang: 1 Punkt. Eine spezielle Regelung gibt es für Unentschieden: ein getipptes Unentschieden bringt nur dann 2 Punkte, wenn es sich vom Ergebnis um genau ein Tor je Mannschaft unterscheidet. Also bei dem Ergebnis 1:1 gibt es 2 Punkte für die Tipps 0:0 und 2:2. Ein 3:3 Tipp bringt nur noch 1 Punkt.",
  },
  {
    value: "drei-zwei-oder-ein-punkt" as const,
    label: "3, 2 oder 1 Punkt",
    description:
      "Exaktes Ergebnis: 3 Punkte · Richtige Tordifferenz: 2 Punkte · Richtiger Ausgang: 1 Punkt.",
  },
  {
    value: "drei-oder-ein-punkt" as const,
    label: "3 oder 1 Punkt",
    description: "Exaktes Ergebnis: 3 Punkte · Richtiger Ausgang: 1 Punkt.",
  },
];

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
  {
    value: "einmal-pro-runde-plus-zwei-zusatzjoker" as const,
    label: "Genau einmal pro Runde plus zwei Zusatzjoker",
    description:
      "Auf einen Tipp kann ein Joker gesetzt werden. Die Punkte dieses Tipps werden verdoppelt. Pro Runde kann maximal ein Joker gesetzt werden. Zusätzlich können im gesamten Turnier bis zu zwei zusätzliche Joker für je 1 Euro gekauft werden. Auf einen Tipp können nicht beide Joker gesetzt werden.",
  },
];

export const MATCH_RULES = [
  { value: "keine-besonderheiten" as const, label: "Keine Besonderheiten", description: "" },
  {
    value: "alleiniger-treffer-drei-punkte" as const,
    label: "Alleiniger Treffer: 3 Punkte extra",
    description:
      "Wer als Einziger Punkte auf ein Spiel bekommt, erhält zusätzlich 3 Bonuspunkte auf den Tipp. Ein eventueller Joker verdoppelt vorher.",
  },
];

export const ROUND_RULES = [
  { value: "keine-besonderheiten" as const, label: "Keine Besonderheiten", description: "" },
  {
    value: "torabweichung-bonus-malus" as const,
    label: "Torabweichung-Bonus und -Malus",
    description:
      "Pro Runde wird für jeden Tipp die Summe der absoluten Abweichungen von Heim- und Auswärtstoren berechnet (Beispiel: Ergebnis 3:1, Tipp 0:2 → |3−0| + |1−2| = 4). Die Abweichungen aller Spiele einer Runde werden je Spieler aufaddiert. Wer die geringste Gesamtabweichung erzielt, erhält 1 Bonuspunkt. Wer die größte Abweichung hat, erhält 1 Punkt Abzug.",
  },
];

export const EXTRA_QUESTION_RULES = [
  {
    value: "mit-zusatzfragen" as const,
    label: "Mit Zusatzfragen",
    description:
      "Es gibt Zusatzfragen, die bei richtiger Antwort Bonuspunkte einbringen. Die Staffelung wird jeweils zu Turnier-Beginn festgelegt.",
  },
  { value: "keine-besonderheiten" as const, label: "Keine Zusatzfragen", description: "" },
];

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
