import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_foh/spieler")({
  head: () => ({
    meta: [
      {
        title: "Spieler - runde.tips",
      },
      {
        name: "description",
        content: "Spieler der Tipprunde der Haus23 Fussballfreunde",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <span className="text-2xl font-medium">Spieler</span>
    </div>
  );
}
