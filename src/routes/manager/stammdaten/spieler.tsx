import { createFileRoute } from "@tanstack/react-router";

import { fetchPlayers } from "@/lib/players.ts";

import { SpielerTable } from "./-spieler-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/spieler")({
  head: () => ({
    meta: [{ title: "Spieler | Stammdaten" }],
  }),
  beforeLoad: () => ({ pageTitle: "Stammdaten | Spieler" }),
  loader: () => fetchPlayers(),
  component: SpielerPage,
});

function SpielerPage() {
  const initialSpieler = Route.useLoaderData();
  return <SpielerTable initialSpieler={initialSpieler} />;
}
