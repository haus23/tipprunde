import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";

import { RankingTable } from "#/components/ranking-table.tsx";
import { archivChampionshipQueryOptions } from "#/lib/archiv.ts";
import { pageTitle } from "#/lib/format.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";

export const Route = createFileRoute("/archiv/$slug")({
  loader: async ({ context, params }) => {
    const { championship } = await context.queryClient.ensureQueryData(
      archivChampionshipQueryOptions(params.slug),
    );
    if (!championship) throw notFound();
    return { championshipName: championship.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle(loaderData?.championshipName, "Archiv") }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { slug } = Route.useParams();
  const {
    data: { championship, ranking },
  } = useSuspenseQuery(archivChampionshipQueryOptions(slug));

  if (!championship) return null;

  return <ChampionshipArchivView championship={championship} ranking={ranking} />;
}

function ChampionshipArchivView({
  championship,
  ranking,
}: {
  championship: { id: number; name: string; extraQuestionPointsPublished: boolean };
  ranking: RankedPlayer[];
}) {
  const showExtras = championship.extraQuestionPointsPublished;

  return (
    <div className="mx-auto w-full max-w-3xl py-8">
      <div className="mb-6 flex flex-col items-center gap-2">
        <Link
          to="/archiv"
          className="text-subtle hover:text-app focus-visible:ring-accent mb-1 flex items-center gap-1 rounded-sm text-xs transition-colors outline-none focus-visible:ring-2"
        >
          <ChevronLeftIcon className="size-3" />
          Archiv
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{championship.name}</h1>
        <p className="text-subtle text-sm">Abschlusstabelle</p>
      </div>
      {ranking.length === 0 ? (
        <p className="text-subtle py-16 text-center text-base">Noch keine Platzierungen.</p>
      ) : (
        <RankingTable
          ranking={ranking}
          showExtras={showExtras}
          currentUserId={undefined}
          championshipId={championship.id}
          isOngoing={false}
          linkPlayers={false}
        />
      )}
    </div>
  );
}
