import { createFileRoute } from "@tanstack/react-router";

import { fetchChampionshipsFn } from "#/app/manager/championships.ts";
import { fetchRulesetsFn } from "#/app/manager/rulesets.ts";

import { TurniereTable } from "./-turniere-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/turniere/")({
  head: () => ({
    meta: [{ title: "Turniere | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Turniere" }),
  loader: async () => {
    const [turniere, regelwerke] = await Promise.all([fetchChampionshipsFn(), fetchRulesetsFn()]);
    return { turniere, regelwerke };
  },
  component: TurnierePage,
});

function TurnierePage() {
  const { turniere, regelwerke } = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Turniere</h1>
      <TurniereTable turniere={turniere} regelwerke={regelwerke} />
    </div>
  );
}
