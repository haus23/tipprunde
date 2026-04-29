import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as v from "valibot";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import { fetchMatchesForRoundFn } from "#/app/manager/matches.ts";
import { fetchPlayersFn } from "#/app/manager/players.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";
import { fetchTeamsFn } from "#/app/manager/teams.ts";
import { Select, SelectItem } from "#/components/(ui)/select.tsx";
import { RundenNavigator } from "#/components/manager/runden-navigator.tsx";
import type { Player } from "#db/dal/players.ts";

import { TippGrid } from "./-tipp-grid.tsx";

export const Route = createFileRoute("/manager/{-$slug}/tipps/")({
  validateSearch: v.object({ runde: v.optional(v.number()) }),
  loaderDeps: ({ search: { runde } }) => ({ runde }),
  beforeLoad: () => ({ pageTitle: "Tipps" }),
  loader: async ({ context: { slug }, deps: { runde } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    if (!championship)
      return { championship: null, rounds: [], players: [], matches: [], teams: [] };

    const [rounds, players, teams] = await Promise.all([
      fetchChampionshipRoundsFn({ data: championship.id }),
      fetchPlayersFn({ data: championship.id }),
      fetchTeamsFn(),
    ]);

    const currentIndex = runde
      ? Math.max(
          rounds.findIndex((r) => r.nr === runde),
          0,
        )
      : rounds.length - 1;
    const matches = rounds[currentIndex]
      ? await fetchMatchesForRoundFn({ data: rounds[currentIndex].id })
      : [];

    return { championship, rounds, players, teams, matches };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Tipps | ${loaderData?.championship?.name}` }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { rounds, players, teams, matches } = Route.useLoaderData();
  const { runde } = Route.useSearch();
  const navigate = useNavigate({ from: "/manager/{-$slug}/tipps/" });

  const currentIndex = runde
    ? Math.max(
        rounds.findIndex((r) => r.nr === runde),
        0,
      )
    : rounds.length - 1;

  const currentRound = rounds[currentIndex];

  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(players[0] ?? null);

  function goToRound(index: number) {
    navigate({ search: { runde: rounds[index].nr }, replace: true });
  }

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-medium md:hidden">Tipps</h1>
        <p className="text-subtle text-sm">Noch keine Runden angelegt.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Tipps</h1>

      <RundenNavigator rounds={rounds} currentIndex={currentIndex} onNavigate={goToRound} />

      <Select
        label="Spieler"
        value={selectedPlayer?.userId ?? null}
        onChange={(key) => {
          setSelectedPlayer(players.find((p) => p.userId === key) ?? null);
        }}
      >
        {players.map((p) => (
          <SelectItem key={p.userId} id={p.userId} textValue={p.user?.name ?? ""}>
            {p.user?.name}
          </SelectItem>
        ))}
      </Select>

      {selectedPlayer && currentRound && (
        <TippGrid
          roundId={currentRound.id}
          userId={selectedPlayer.userId}
          matches={matches}
          teams={teams}
        />
      )}
    </div>
  );
}
