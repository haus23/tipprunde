import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/{-$slug}/spiele")({
  beforeLoad: () => ({ pageTitle: "Spiele" }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-medium md:hidden">Spiele</h1>
    </div>
  );
}
