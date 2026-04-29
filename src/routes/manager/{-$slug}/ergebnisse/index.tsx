import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as v from "valibot";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";
import { RundenNavigator } from "#/components/manager/runden-navigator.tsx";

export const Route = createFileRoute("/manager/{-$slug}/ergebnisse/")({
  validateSearch: v.object({ runde: v.optional(v.number()) }),
  loaderDeps: ({ search: { runde } }) => ({ runde }),
  beforeLoad: () => ({ pageTitle: "Ergebnisse" }),
  loader: async ({ context: { slug }, deps: { runde } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    if (!championship) return { championship: null, rounds: [], currentIndex: -1 };

    const rounds = await fetchChampionshipRoundsFn({ data: championship.id });

    const currentIndex = runde
      ? Math.max(rounds.findIndex((r) => r.nr === runde), 0)
      : rounds.length - 1;

    return { championship, rounds, currentIndex };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Ergebnisse | ${loaderData?.championship?.name}` }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { rounds, currentIndex } = Route.useLoaderData();
  const navigate = useNavigate({ from: "/manager/{-$slug}/ergebnisse/" });

  function goToRound(index: number) {
    navigate({ search: { runde: rounds[index].nr }, replace: true });
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
    </div>
  );
}
