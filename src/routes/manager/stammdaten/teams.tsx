import { createFileRoute } from "@tanstack/react-router";
import { fetchTeams } from "@/lib/teams.ts";
import { TeamsTable } from "./-teams-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/teams")({
  head: () => ({
    meta: [{ title: "Teams | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Teams" }),
  loader: () => fetchTeams(),
  component: TeamsPage,
});

function TeamsPage() {
  const initialTeams = Route.useLoaderData();
  return <TeamsTable initialTeams={initialTeams} />;
}
