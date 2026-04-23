import { createFileRoute } from "@tanstack/react-router";

import { fetchTeamsFn } from "#/app/manager/teams.ts";

import { TeamsTable } from "./-teams-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/teams/")({
  head: () => ({
    meta: [{ title: "Teams | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Teams" }),
  loader: () => fetchTeamsFn(),
  component: TeamsPage,
});

function TeamsPage() {
  const initialTeams = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Teams</h1>
      <TeamsTable initialTeams={initialTeams} />
    </div>
  );
}
