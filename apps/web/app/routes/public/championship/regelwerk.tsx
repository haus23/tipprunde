import { hasExtraQuestions } from "@tipprunde/domain/ranking";

import { ChampionshipRegelwerk } from "#/components/championship-regelwerk.tsx";
import { useScopedPath } from "#/components/championship-scope.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import { getRuleset } from "#/lib/championship.server.ts";
import { viewedChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/regelwerk";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(viewedChampionshipContext)!;
  const ruleset = await getRuleset(championship.id);
  return { championship, ruleset };
}

export default function Regelwerk({ loaderData }: Route.ComponentProps) {
  const { championship, ruleset } = loaderData;
  const scoped = useScopedPath();

  return (
    // The shell's <main> only pads from xs up, so prose adds its own below
    // that — the same `px-4 xs:px-0` the layout's header uses. (Tables are
    // deliberately full-bleed there, which is why main leaves it to the page.)
    <div className="xs:px-0 mx-auto w-full max-w-3xl px-4">
      <title>{`Regelwerk · ${championship.name} · runde.tips`}</title>
      {ruleset ? (
        <ChampionshipRegelwerk ruleset={ruleset} showHeading={false}>
          {hasExtraQuestions({ extraQuestionRuleId: ruleset.extraQuestionRuleId }) && (
            <div className="mt-4 flex justify-end">
              <SectionLink to={scoped("/zusatzfragen")}>Zusatzfragen →</SectionLink>
            </div>
          )}
        </ChampionshipRegelwerk>
      ) : (
        <p className="text-subtle py-16 text-center text-base">Kein Regelwerk hinterlegt.</p>
      )}
    </div>
  );
}
