import { cx } from "@tipprunde/ui";

import { RankingTable } from "#/components/ranking-table.tsx";
import { getTurnierComment } from "#/lib/content.server.ts";
import { userContext, viewedChampionshipContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";

import type { Route } from "./+types/index";
import { ChampionshipComment } from "./_comment.tsx";

/**
 * The championship's own page: its table — the one thing every visitor comes
 * for — and, once someone has written one, the Stadionsenf beside it, the
 * story of how that table came about. A running championship usually has no
 * comment yet, so it shows the table alone. See
 * docs/decisions/14-turnier-tabelle-stadionsenf.md.
 */
export async function loader({ context }: Route.LoaderArgs) {
  // Non-null: the branch layout above throws when it cannot resolve one.
  const championship = context.get(viewedChampionshipContext)!;
  const user = context.get(userContext);

  const [ranking, comment] = await Promise.all([
    getRanking(championship.id),
    getTurnierComment(championship.slug),
  ]);

  return {
    championship: {
      id: championship.id,
      name: championship.name,
      completed: championship.completed,
      extraQuestionPointsPublished: championship.extraQuestionPointsPublished,
    },
    ranking,
    comment,
    currentUserId: user?.id,
  };
}

export default function ChampionshipTable({ loaderData }: Route.ComponentProps) {
  const { championship, ranking, comment, currentUserId } = loaderData;

  const table =
    ranking.length === 0 ? (
      <p className="text-subtle py-16 text-center text-base">Noch keine Platzierungen.</p>
    ) : (
      <RankingTable
        ranking={ranking}
        showExtras={championship.extraQuestionPointsPublished ?? false}
        currentUserId={currentUserId}
        isOngoing={!championship.completed}
        championshipId={championship.id}
      />
    );

  return (
    <div
      className={cx(
        "mx-auto w-full",
        // Side by side from lg up, the comment under the table below that.
        comment ? "grid gap-x-10 gap-y-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" : "max-w-3xl",
      )}
    >
      <title>{`${championship.name} · runde.tips`}</title>
      <div>{table}</div>
      {comment && <ChampionshipComment comment={comment} />}
    </div>
  );
}
