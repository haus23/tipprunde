import { createFileRoute } from "@tanstack/react-router";
import { fetchRulesets } from "@/lib/rulesets.ts";
import { fetchTurniere } from "@/lib/championships.ts";
import { TurniereTable } from "./-turnier-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/turniere")({
  head: () => ({
    meta: [{ title: "Turniere | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Turniere" }),
  loader: async () => {
    const [turniere, regelwerke] = await Promise.all([
      fetchTurniere(),
      fetchRulesets(),
    ]);
    return { turniere, regelwerke };
  },
  component: TurnierePage,
});

function TurnierePage() {
  const { turniere, regelwerke } = Route.useLoaderData();
  return <TurniereTable turniere={turniere} regelwerke={regelwerke} />;
}
