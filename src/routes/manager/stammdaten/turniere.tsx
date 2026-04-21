import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/stammdaten/turniere")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Stammdaten Turnierseite</div>;
}
