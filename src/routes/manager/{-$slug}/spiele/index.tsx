import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as v from "valibot";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import { fetchLeaguesFn } from "#/app/manager/leagues.ts";
import { fetchMatchesForRoundFn } from "#/app/manager/matches.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";
import { fetchTeamsFn } from "#/app/manager/teams.ts";
import type { Match } from "#db/dal/matches.ts";

import { RundenNavigator } from "#/components/manager/runden-navigator.tsx";

import { SpielForm } from "./-spiel-form.tsx";
import { SpieleList } from "./-spiele-list.tsx";

export const Route = createFileRoute("/manager/{-$slug}/spiele/")({
  validateSearch: v.object({ runde: v.optional(v.number()) }),
  beforeLoad: () => ({ pageTitle: "Spiele" }),
  head: ({ loaderData }) => ({
    meta: [{ title: `Spiele | ${loaderData?.championship?.name}` }],
  }),
  loader: async ({ context: { slug } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    const rounds = championship ? await fetchChampionshipRoundsFn({ data: championship.id }) : [];
    const [matchesByRound, leagues, teams] = await Promise.all([
      Promise.all(rounds.map((r) => fetchMatchesForRoundFn({ data: r.id }))),
      fetchLeaguesFn(),
      fetchTeamsFn(),
    ]);
    return { championship, rounds, matchesByRound, leagues, teams };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { rounds, matchesByRound, leagues, teams } = Route.useLoaderData();
  const { runde } = Route.useSearch();
  const navigate = useNavigate({ from: "/manager/{-$slug}/spiele/" });

  const currentIndex = runde
    ? Math.max(rounds.findIndex((r) => r.nr === runde), 0)
    : rounds.length - 1;

  const currentRound = rounds[currentIndex];

  const [matches, setMatches] = useState<Match[][]>(matchesByRound);
  const [editMatch, setEditMatch] = useState<Match | null>(null);

  const defaultDate = matches.flat().findLast((m) => m.date)?.date ?? undefined;

  function goToRound(index: number) {
    navigate({ search: { runde: rounds[index].nr }, replace: true });
    setEditMatch(null);
  }

  function handleSaved(updatedMatches: Match[]) {
    setMatches((prev) => prev.map((m, i) => (i === currentIndex ? updatedMatches : m)));
    setEditMatch(null);
  }

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-medium md:hidden">Spiele</h1>
        <p className="text-subtle text-sm">Noch keine Runden angelegt.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Spiele</h1>

      <RundenNavigator
        rounds={rounds}
        currentIndex={currentIndex}
        onNavigate={goToRound}
      />

      <SpielForm
        roundId={currentRound.id}
        editMatch={editMatch}
        defaultDate={defaultDate}
        leagues={leagues}
        teams={teams}
        onSaved={handleSaved}
        onCancel={() => setEditMatch(null)}
      />

      <SpieleList
        matches={matches[currentIndex] ?? []}
        leagues={leagues}
        teams={teams}
        onEdit={setEditMatch}
      />
    </div>
  );
}
