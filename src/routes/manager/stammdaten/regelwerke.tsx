import { createFileRoute } from "@tanstack/react-router";

import { fetchRulesets } from "@/lib/rulesets.ts";

import { RegelwerkeTable } from "./-regelwerk-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/regelwerke")({
  head: () => ({
    meta: [{ title: "Regelwerke | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Regelwerke" }),
  loader: () => fetchRulesets(),
  component: RegelwerkePage,
});

function RegelwerkePage() {
  const initialRegelwerke = Route.useLoaderData();
  return <RegelwerkeTable initialRegelwerke={initialRegelwerke} />;
}
