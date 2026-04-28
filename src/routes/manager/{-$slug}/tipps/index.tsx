import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as v from "valibot";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";
import { RundenNavigator } from "#/components/manager/runden-navigator.tsx";

export const Route = createFileRoute("/manager/{-$slug}/tipps/")({
  validateSearch: v.object({ runde: v.optional(v.number()) }),
  beforeLoad: () => ({ pageTitle: "Tipps" }),
  loader: async ({ context: { slug } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    const rounds = championship ? await fetchChampionshipRoundsFn({ data: championship.id }) : [];
    return { rounds };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { rounds } = Route.useLoaderData();
  const { runde } = Route.useSearch();
  const navigate = useNavigate({ from: "/manager/{-$slug}/tipps/" });

  const currentIndex = runde
    ? Math.max(rounds.findIndex((r) => r.nr === runde), 0)
    : rounds.length - 1;

  const currentRound = rounds[currentIndex];

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

      <RundenNavigator
        rounds={rounds}
        currentIndex={currentIndex}
        onNavigate={goToRound}
      />
    </div>
  );
}
