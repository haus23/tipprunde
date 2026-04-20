import { createFileRoute } from "@tanstack/react-router";

import { fetchRulesetsFn } from "#/app/manager/rulesets.ts";

import { RegelwerkeTable } from "./-regelwerk-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/regelwerke")({
  head: () => ({
    meta: [{ title: "Regelwerke | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Regelwerke" }),
  loader: () => fetchRulesetsFn(),
  component: RegelwerkePage,
});

function RegelwerkePage() {
  const initialRegelwerke = Route.useLoaderData();
  return <RegelwerkeTable initialRegelwerke={initialRegelwerke} />;
}
