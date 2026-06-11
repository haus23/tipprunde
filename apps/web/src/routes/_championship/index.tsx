import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_championship/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, user } = Route.useRouteContext();
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-10 text-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p className="text-subtle mt-1 text-lg">{championship?.name}</p>
      </div>
      {user && <p className="text-center text-sm">Angemeldet als {user.name}</p>}
    </div>
  );
}
