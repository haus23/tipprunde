import { createFileRoute } from "@tanstack/react-router";

import { fetchLeaguesFn } from "#/app/manager/leagues.ts";

import { LigenTable } from "./-ligen-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/ligen")({
  head: () => ({
    meta: [{ title: "Ligen | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Ligen" }),
  loader: () => fetchLeaguesFn(),
  component: LigenPage,
});

function LigenPage() {
  const initialLigen = Route.useLoaderData();
  return <LigenTable initialLigen={initialLigen} />;
}
