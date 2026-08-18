import { hasExtraQuestions } from "@tipprunde/domain/ranking";

import { ChampionshipRegelwerk } from "#/components/championship-regelwerk.tsx";
import { useChampionshipScope, useScopedPath } from "#/components/championship-scope.tsx";
import { getPublicChampionships, getRuleset } from "#/lib/championship.server.ts";
import { userContext, viewedChampionshipContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";
import { getCurrentMatches } from "#/lib/spiele.server.ts";

import type { Route } from "./+types/index";
import { ChampionshipCurrentMatches } from "./_overview/current-matches.tsx";
import { SectionLink } from "./_overview/section-link.tsx";
import { ChampionshipStandings } from "./_overview/standings.tsx";
import { ChampionshipSwitcher } from "./_switcher.tsx";

export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const user = context.get(userContext);

  const [ranking, matches, ruleset, publicChampionships] = await Promise.all([
    getRanking(championship.id),
    getCurrentMatches(championship.id),
    getRuleset(championship.id),
    getPublicChampionships(),
  ]);

  // Sorted nr desc — the first entry is the running championship, the only
  // one the switcher links to "/" rather than its /archiv/<slug>.
  const runningSlug = publicChampionships[0]?.slug;
  const switcherChampionships = publicChampionships.map((c) => ({
    slug: c.slug,
    name: c.name,
    href: c.slug === runningSlug ? "/" : `/archiv/${c.slug}`,
  }));

  return {
    championship: {
      slug: championship.slug,
      name: championship.name,
      completed: championship.completed,
    },
    ranking,
    matches,
    ruleset,
    userId: user?.id,
    switcherChampionships,
  };
}

export default function ChampionshipOverview({ loaderData }: Route.ComponentProps) {
  const { championship, ranking, matches, ruleset, userId, switcherChampionships } = loaderData;
  const scoped = useScopedPath();
  const { isArchived } = useChampionshipScope();

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>{`${championship.name} · runde.tips`}</title>
      {/* The site identity belongs to the running season's landing page; an
          archived one gets the same heading shape as every other view. */}
      <div className="mb-10 flex flex-col items-center">
        {isArchived ? (
          <>
            <div className="flex items-center gap-1">
              <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
              <ChampionshipSwitcher
                championships={switcherChampionships}
                currentSlug={championship.slug}
              />
            </div>
            <p className="text-subtle text-sm">Übersicht</p>
          </>
        ) : (
          <>
            <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
            <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
            <div className="mt-1 flex items-center gap-1">
              <p className="text-subtle text-lg">{championship.name}</p>
              <ChampionshipSwitcher
                championships={switcherChampionships}
                currentSlug={championship.slug}
              />
            </div>
          </>
        )}
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          <ChampionshipStandings
            ranking={ranking}
            completed={championship.completed}
            userId={userId}
          />
          <ChampionshipCurrentMatches matches={matches} completed={championship.completed} />
        </div>
        {ruleset && (
          <ChampionshipRegelwerk ruleset={ruleset}>
            {hasExtraQuestions({ extraQuestionRuleId: ruleset.extraQuestionRuleId }) && (
              <div className="mt-4 flex justify-end">
                <SectionLink to={scoped("/zusatzfragen")}>Zusatzfragen →</SectionLink>
              </div>
            )}
          </ChampionshipRegelwerk>
        )}
      </div>
    </div>
  );
}
