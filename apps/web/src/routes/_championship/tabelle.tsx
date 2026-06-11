import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_championship/tabelle")({
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();
  return (
    <div className="mx-auto w-full max-w-5xl py-8">
      <div className="xs:px-0 mb-6 flex flex-col items-center gap-2 px-4">
        <h1 className="text-2xl font-semibold tracking-tight">Tabelle</h1>
        <p className="text-subtle text-sm">{championship?.name}</p>
      </div>
    </div>
  );
}
