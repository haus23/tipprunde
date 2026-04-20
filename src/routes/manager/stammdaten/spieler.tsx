import { createFileRoute } from "@tanstack/react-router";

import { fetchUsersFn } from "#/app/manager/users.ts";

import { SpielerTable } from "./-spieler-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/spieler")({
  head: () => ({
    meta: [{ title: "Spieler | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Spieler" }),
  loader: () => fetchUsersFn(),
  component: SpielerPage,
});

function SpielerPage() {
  const initialSpieler = Route.useLoaderData();
  return <SpielerTable initialSpieler={initialSpieler} />;
}
