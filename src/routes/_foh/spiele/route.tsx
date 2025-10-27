import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_foh/spiele")({
  head: () => ({
    meta: [
      {
        title: "Spiele - runde.tips",
      },
      {
        name: "description",
        content: "Spiele der Tipprunde der Haus23 Fussballfreunde",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <span className="text-2xl font-medium">Spiele</span>
    </div>
  );
}
