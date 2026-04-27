import { createFileRoute } from "@tanstack/react-router";

import { fetchRulesetsFn } from "#/app/manager/rulesets.ts";

import { RegelwerkeTable } from "./-regelwerke-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/regelwerke/")({
  head: () => ({
    meta: [{ title: "Regelwerke | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Regelwerke" }),
  loader: () => fetchRulesetsFn(),
  component: RegelwerkePage,
});

function RegelwerkePage() {
  const regelwerke = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Regelwerke</h1>
      <RegelwerkeTable regelwerke={regelwerke} />
    </div>
  );
}
