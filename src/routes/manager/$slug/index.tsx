import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/$slug/")({
  component: ChampionshipDashboard,
});

function ChampionshipDashboard() {
  const { currentChampionship } = Route.useRouteContext();
  return (
    <div>
      <p>{currentChampionship?.name}</p>
    </div>
  );
}
