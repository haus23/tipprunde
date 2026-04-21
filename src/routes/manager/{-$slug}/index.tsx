import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/{-$slug}/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Turnierseite</div>;
}
