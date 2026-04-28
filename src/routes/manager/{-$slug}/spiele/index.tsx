import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as v from "valibot";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import { fetchChampionshipRoundsFn } from "#/app/manager/rounds.ts";

export const Route = createFileRoute("/manager/{-$slug}/spiele/")({
  validateSearch: v.object({ runde: v.optional(v.number()) }),
  beforeLoad: () => ({ pageTitle: "Spiele" }),
  loader: async ({ context: { slug } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    const rounds = championship ? await fetchChampionshipRoundsFn({ data: championship.id }) : [];
    return { championship, rounds };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { rounds } = Route.useLoaderData();
  const { runde } = Route.useSearch();
  const navigate = useNavigate({ from: "/manager/{-$slug}/spiele/" });

  const currentIndex = runde
    ? Math.max(rounds.findIndex((r) => r.nr === runde), 0)
    : rounds.length - 1;

  const currentRound = rounds[currentIndex];

  function goToRound(index: number) {
    navigate({ search: { runde: rounds[index].nr }, replace: true });
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Spiele</h1>

      {rounds.length === 0 ? (
        <p className="text-subtle text-sm">Noch keine Runden angelegt.</p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <button
              onClick={() => goToRound(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="hover:bg-subtle focus-visible:ring-focus rounded-md p-1 outline-none focus-visible:ring-2 disabled:opacity-40"
              aria-label="Vorherige Runde"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <span className="text-sm font-medium">
              Runde {currentRound.nr} von {rounds.length}
            </span>
            <button
              onClick={() => goToRound(currentIndex + 1)}
              disabled={currentIndex === rounds.length - 1}
              className="hover:bg-subtle focus-visible:ring-focus rounded-md p-1 outline-none focus-visible:ring-2 disabled:opacity-40"
              aria-label="Nächste Runde"
            >
              <ChevronRightIcon size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
