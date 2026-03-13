import { createFileRoute } from "@tanstack/react-router";
import { fetchPlayers } from "@/lib/players.ts";
import { SpielerTable } from "./-spieler-table.tsx";

export const Route = createFileRoute("/manager/stammdaten/spieler")({
  loader: () => fetchPlayers(),
  component: SpielerPage,
});

function SpielerPage() {
  const spieler = Route.useLoaderData();
  return <SpielerTable spieler={spieler} />;
}
