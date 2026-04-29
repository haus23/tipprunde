import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_front/spiele")({
  head: () => ({ meta: [{ title: "Spiele" }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Spiele</h1>
    </div>
  );
}
