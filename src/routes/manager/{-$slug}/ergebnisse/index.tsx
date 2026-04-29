"use client";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import * as v from "valibot";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import { fetchMatchesForRoundFn, updateMatchFn } from "#/app/manager/matches.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";
import { fetchTeamsFn } from "#/app/manager/teams.ts";
import { RundenNavigator } from "#/components/manager/runden-navigator.tsx";
import type { Match } from "#db/dal/matches.ts";
import type { Team } from "#db/dal/teams.ts";

const RESULT_PATTERN = /^\d{1,2}:\d{1,2}$/;

function normalizeResult(raw: string): string {
  return raw.replace(/\s+/g, "").replace(/[-.]/g, ":").replace(/:+/g, ":");
}

function teamName(teams: Team[], id: string | null) {
  return teams.find((t) => t.id === id)?.name ?? "—";
}

function teamShortName(teams: Team[], id: string | null) {
  return teams.find((t) => t.id === id)?.shortName ?? "—";
}

export const Route = createFileRoute("/manager/{-$slug}/ergebnisse/")({
  validateSearch: v.object({ runde: v.optional(v.number()) }),
  loaderDeps: ({ search: { runde } }) => ({ runde }),
  beforeLoad: () => ({ pageTitle: "Ergebnisse" }),
  loader: async ({ context: { slug }, deps: { runde } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    if (!championship)
      return { championship: null, rounds: [], matches: [], teams: [], currentIndex: -1 };

    const [rounds, teams] = await Promise.all([
      fetchChampionshipRoundsFn({ data: championship.id }),
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

    return { championship, rounds, matches, teams, currentIndex };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Ergebnisse | ${loaderData?.championship?.name}` }],
  }),
  component: RouteComponent,
});

type ResultState = Record<number, { result: string; invalid?: boolean }>;

function RouteComponent() {
  const { rounds, matches, teams, currentIndex } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/manager/{-$slug}/ergebnisse/" });

  const [resultState, setResultState] = useState<ResultState>(() =>
    Object.fromEntries(matches.map((m) => [m.id, { result: m.result ?? "" }])),
  );

  function goToRound(index: number) {
    void navigate({ search: { runde: rounds[index].nr }, replace: true });
  }

  async function handleBlur(match: Match) {
    const raw = resultState[match.id]?.result ?? "";
    const normalized = normalizeResult(raw);
    const invalid = normalized !== "" && !RESULT_PATTERN.test(normalized);
    setResultState((prev) => ({ ...prev, [match.id]: { result: normalized, invalid } }));
    if (invalid) return;
    await updateMatchFn({
      data: {
        id: match.id,
        date: match.date,
        leagueId: match.leagueId,
        hometeamId: match.hometeamId,
        awayteamId: match.awayteamId,
        result: normalized || null,
      },
    });
  }

  if (rounds.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-medium md:hidden">Ergebnisse</h1>
        <p className="text-subtle text-sm">Noch keine Runden angelegt.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Ergebnisse</h1>
      <RundenNavigator rounds={rounds} currentIndex={currentIndex} onNavigate={goToRound} />
      <div className="bg-surface border-surface rounded-md border px-4 py-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-input border-b text-left">
              <th className="text-subtle w-px px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
                #
              </th>
              <th className="text-subtle px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
                Spiel
              </th>
              <th className="text-subtle w-px px-1 pt-2 pb-3 text-center text-xs font-medium tracking-wide uppercase">
                Ergebnis
              </th>
            </tr>
          </thead>
          <tbody>
            {matches.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-subtle px-2 py-6 text-center">
                  Noch keine Spiele in dieser Runde.
                </td>
              </tr>
            ) : (
              matches.map((match) => (
                <tr key={match.id} className="border-input border-b last:border-b-0">
                  <td className="w-px px-2 py-2">{match.nr}</td>
                  <td className="px-2 py-2">
                    <span className="md:hidden">
                      {teamShortName(teams, match.hometeamId)} –{" "}
                      {teamShortName(teams, match.awayteamId)}
                    </span>
                    <span className="hidden md:inline">
                      {teamName(teams, match.hometeamId)} – {teamName(teams, match.awayteamId)}
                    </span>
                  </td>
                  <td className="px-1 py-1.5 text-center">
                    <input
                      type="text"
                      value={resultState[match.id]?.result ?? ""}
                      onChange={(e) =>
                        setResultState((prev) => ({
                          ...prev,
                          [match.id]: { result: e.target.value, invalid: false },
                        }))
                      }
                      onBlur={() => handleBlur(match)}
                      aria-invalid={resultState[match.id]?.invalid}
                      className="border-input focus-visible:ring-focus aria-invalid:border-error aria-invalid:text-error w-12 rounded-md border bg-transparent px-2 py-1 text-center text-sm outline-none focus-visible:ring-2"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
