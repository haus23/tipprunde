import { RULE_CATEGORIES } from "@tipprunde/domain/rules";

import type { Ruleset } from "#/lib/championship.server.ts";

import { SectionHeading } from "./section-heading.tsx";

/**
 * A championship's ruleset: its description and every rule it activates.
 */
export function ChampionshipRegelwerk({
  ruleset,
  showHeading = true,
}: {
  ruleset: Ruleset;
  /** Archiv's own sub-nav already announces "Regelwerk" — repeating it as a
   * heading right below the active nav item read as redundant there. */
  showHeading?: boolean;
}) {
  const activeRules = RULE_CATEGORIES.flatMap(({ field, label, rules }) => {
    const ruleId = ruleset[field];
    if (!ruleId || ruleId === "keine-besonderheiten") return [];
    const rule = rules.find((r) => r.value === ruleId);
    return rule ? [{ label, description: rule.description }] : [];
  });

  return (
    <section className="sm:mx-auto sm:max-w-lg">
      {showHeading && <SectionHeading>Regelwerk</SectionHeading>}
      <p className="text-subtle text-base">{ruleset.description}</p>
      <div className="mt-4 flex flex-col gap-3">
        {activeRules.map((rule) => (
          <div key={rule.label}>
            <p className="text-base font-medium">{rule.label}</p>
            <p className="text-subtle text-base">{rule.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
