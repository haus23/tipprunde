import { createFileRoute } from "@tanstack/react-router";

import { fetchUsersFn } from "#/app/manager/users.ts";

import { SpielerTable } from "./-spieler-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/spieler/")({
  head: () => ({
    meta: [{ title: "Spieler | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Spieler" }),
  loader: () => fetchUsersFn(),
  component: SpielerPage,
});

function SpielerPage() {
  const spieler = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Spieler</h1>
      <SpielerTable spieler={spieler} />
    </div>
  );
}
