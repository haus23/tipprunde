import { createFileRoute } from "@tanstack/react-router";

import { fetchChampionshipsFn } from "#/app/manager/championships.ts";
import { fetchRulesetsFn } from "#/app/manager/rulesets.ts";

import { TurniereTable } from "./-turnier-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/turniere")({
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
  return <TurniereTable initialTurniere={turniere} initialRegelwerke={regelwerke} />;
}
