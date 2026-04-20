import { createFileRoute } from "@tanstack/react-router";

import { fetchLeagues } from "@/lib/leagues.ts";

import { LigenTable } from "./-ligen-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/ligen")({
  head: () => ({
    meta: [{ title: "Ligen | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Ligen" }),
  loader: () => fetchLeagues(),
  component: LigenPage,
});

function LigenPage() {
  const initialLigen = Route.useLoaderData();
  return <LigenTable initialLigen={initialLigen} />;
}
