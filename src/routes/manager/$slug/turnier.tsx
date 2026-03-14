import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/$slug/turnier")({
  component: TurnierPage,
});

function TurnierPage() {
  const { currentChampionship } = Route.useRouteContext();
  return (
    <div>
      <p>{currentChampionship?.name}</p>
    </div>
  );
}
