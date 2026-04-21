import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { fetchTurnierDetails } from "@/lib/championships.ts";
import { fetchLeaguesFn } from "#/app/manager/leagues.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";
import { fetchTeamsFn } from "#/app/manager/teams.ts";

import { MatchesTable } from "./-matches-table.tsx";

export const Route = createFileRoute("/manager/$slug/spiele")({
  beforeLoad: () => ({ pageTitle: "Spiele" }),
  validateSearch: v.object({ nr: v.optional(v.number(), 1) }),
  loader: async ({ params }) => {
    const championship = await fetchTurnierDetails({ data: params.slug });
    if (!championship) return { championship: null, rounds: [], leagues: [], teams: [] };
    const [rounds, leagues, teams] = await Promise.all([
      fetchChampionshipRoundsFn({ data: championship.id }),
      fetchLeaguesFn(),
      fetchTeamsFn(),
    ]);
    return { championship, rounds, leagues, teams };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Spiele | ${loaderData?.championship?.name}` }],
  }),
  component: SpielePage,
});

function SpielePage() {
  const { championship, rounds, leagues, teams } = Route.useLoaderData();
  const { nr } = Route.useSearch();
  const navigate = Route.useNavigate();

  if (!championship) return null;

  const activeRound = rounds.find((r) => r.nr === nr) ?? rounds[0];

  if (rounds.length === 0) {
    return (
      <p className="text-subtle text-sm">
        Noch keine Runden angelegt. Bitte zuerst auf der{" "}
        <span className="font-medium">Turnier</span>-Seite eine Runde erstellen.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="border-layout flex gap-1 border-b">
        {rounds.map((round) => (
          <button
            key={round.id}
            type="button"
            onClick={() => navigate({ search: { nr: round.nr } })}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              round.nr === activeRound?.nr
                ? "-mb-px border-b-2 border-current"
                : "text-subtle hover:text-base"
            }`}
          >
            Runde {round.nr}
          </button>
        ))}
      </div>

      {activeRound && (
        <div className="bg-surface border-surface rounded-md border p-6">
          <h2 className="mb-4 text-sm font-medium">Runde {activeRound.nr}</h2>
          <MatchesTable roundId={activeRound.id} leagues={leagues} teams={teams} />
        </div>
      )}
    </div>
  );
}
