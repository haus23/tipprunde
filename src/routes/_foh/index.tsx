import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_foh/")({
  head: () => ({
    meta: [
      {
        title: "Tabelle - runde.tips",
      },
      {
        name: "description",
        content: "Tabelle der Tipprunde der Haus23 Fussballfreunde",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <span className="text-2xl font-medium">Tabelle</span>
    </div>
  );
}
