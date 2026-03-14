import { createFileRoute } from "@tanstack/react-router";
import { fetchRulesets } from "@/lib/rulesets.ts";
import { RegelwerkeTable } from "./-regelwerk-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/regelwerke")({
  head: () => ({
    meta: [{ title: "Stammdaten - Regelwerke" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten - Regelwerke" }),
  loader: () => fetchRulesets(),
  component: RegelwerkePage,
});

function RegelwerkePage() {
  const regelwerke = Route.useLoaderData();
  return <RegelwerkeTable regelwerke={regelwerke} />;
}
