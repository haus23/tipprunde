import { hasExtraQuestions } from "@tipprunde/domain/ranking";

import { ChampionshipRegelwerk } from "#/components/championship-regelwerk.tsx";
import { useScopedPath } from "#/components/championship-scope.tsx";
import { getRuleset } from "#/lib/championship.server.ts";
import { getTurnierComment } from "#/lib/content.server.ts";
import { userContext, viewedChampionshipContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";
import { getCurrentMatches } from "#/lib/spiele.server.ts";

import type { Route } from "./+types/index";
import { ChampionshipComment } from "./_overview/comment.tsx";
import { ChampionshipCurrentMatches } from "./_overview/current-matches.tsx";
import { SectionLink } from "./_overview/section-link.tsx";
import { ChampionshipStandings } from "./_overview/standings.tsx";

export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const user = context.get(userContext);

  const [ranking, matches, ruleset, comment] = await Promise.all([
    getRanking(championship.id),
    getCurrentMatches(championship.id),
    getRuleset(championship.id),
    // Shown on the running championship's own homepage too, not just the
    // Archiv — usually null there until it wraps up and gets one written,
    // same as any other tournament before its comment exists.
    getTurnierComment(championship.slug),
  ]);

  return {
    championship: { name: championship.name, completed: championship.completed },
    ranking,
    matches,
    ruleset,
    userId: user?.id,
    comment,
  };
}

export default function ChampionshipOverview({ loaderData }: Route.ComponentProps) {
  const { championship, ranking, matches, ruleset, userId, comment } = loaderData;
  const scoped = useScopedPath();

  const regelwerk = ruleset && (
    <ChampionshipRegelwerk ruleset={ruleset}>
      {hasExtraQuestions({ extraQuestionRuleId: ruleset.extraQuestionRuleId }) && (
        <div className="mt-4 flex justify-end">
          <SectionLink to={scoped("/zusatzfragen")}>Zusatzfragen →</SectionLink>
        </div>
      )}
    </ChampionshipRegelwerk>
  );

  return (
    <div className="xs:px-6 mx-auto flex w-full max-w-4xl flex-col gap-10 px-4">
      <title>{`${championship.name} · runde.tips`}</title>
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
        <ChampionshipStandings
          ranking={ranking}
          completed={championship.completed}
          userId={userId}
        />
        <ChampionshipCurrentMatches matches={matches} completed={championship.completed} />
        {/* A Stadionsenf comment claims the grid's second row — Kommentar
            under the table, Regelwerk under Letzte Spiele — instead of the
            centered block below. On a single column (small screens),
            auto-flow stacks all four in this same DOM order: Tabelle,
            Letzte Spiele, Kommentar, Regelwerk. */}
        {comment && (
          <>
            <ChampionshipComment comment={comment} />
            {regelwerk}
          </>
        )}
      </div>
      {!comment && regelwerk}
    </div>
  );
}
