import { hasExtraQuestions } from "@tipprunde/domain/ranking";
import { RULE_CATEGORIES } from "@tipprunde/domain/rules";

import { SectionHeading } from "#/components/section-heading.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import type { Ruleset } from "#/lib/ruleset.ts";

export function ChampionshipRegelwerk({ ruleset }: { ruleset: Ruleset }) {
  const activeRules = RULE_CATEGORIES.flatMap(({ field, label, rules }) => {
    const ruleId = ruleset[field];
    if (!ruleId || ruleId === "keine-besonderheiten") return [];
    const rule = rules.find((r) => r.value === ruleId);
    return rule ? [{ label, description: rule.description }] : [];
  });
  const showExtraQuestions = hasExtraQuestions({
    extraQuestionRuleId: ruleset.extraQuestionRuleId,
  });

  return (
    <section className="sm:mx-auto sm:max-w-lg">
      <SectionHeading>Regelwerk</SectionHeading>
      <p className="text-subtle text-base">{ruleset.description}</p>
      <div className="mt-4 flex flex-col gap-3">
        {activeRules.map((rule) => (
          <div key={rule.label}>
            <p className="text-base font-medium">{rule.label}</p>
            <p className="text-subtle text-base">{rule.description}</p>
          </div>
        ))}
      </div>
      {showExtraQuestions && (
        <div className="mt-4 flex justify-end">
          <SectionLink to="/zusatzfragen">Zusatzfragen →</SectionLink>
        </div>
      )}
    </section>
  );
}
