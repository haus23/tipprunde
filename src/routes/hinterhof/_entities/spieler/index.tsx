import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hinterhof/_entities/spieler/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <span className="text-2xl font-medium">Spieler</span>
    </div>
  );
}
