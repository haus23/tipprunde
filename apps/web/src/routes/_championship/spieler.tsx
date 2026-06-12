import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_championship/spieler")({
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();
  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <div className="mb-6 flex flex-col items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Spielerübersicht</h1>
        <p className="text-subtle text-sm">{championship?.name}</p>
      </div>
    </div>
  );
}
