import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/{-$slug}/spiele")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Spieleseite</div>;
}
