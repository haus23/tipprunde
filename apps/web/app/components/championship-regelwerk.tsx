import { RULE_CATEGORIES } from "@tipprunde/domain/rules";

import type { Ruleset } from "#/lib/championship.server.ts";

import { SectionHeading } from "./section-heading.tsx";

/**
 * Shared between the dashboard (current championship) and the Archiv
 * (completed ones) — kept free of any route-specific assumptions. The
 * dashboard's own "Zusatzfragen →" link is passed in as children rather than
 * hardcoded here, since that route only ever shows the *current* season's
 * questions and would be wrong to link to from an archived one.
 */
export function ChampionshipRegelwerk({
  ruleset,
  showHeading = true,
  children,
}: {
  ruleset: Ruleset;
  /** Archiv's own sub-nav already announces "Regelwerk" — repeating it as a
   * heading right below the active nav item read as redundant there. */
  showHeading?: boolean;
  children?: React.ReactNode;
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
      {children}
    </section>
  );
}
