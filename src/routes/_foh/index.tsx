import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_foh/")({
  head: () => ({
    meta: [
      {
        title: "runde.tips",
      },
      {
        name: "description",
        content: "Tipprunde der Haus23 Fussballfreunde",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <span>runde.tips</span>
    </div>
  );
}
