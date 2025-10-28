import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/hinterhof/_dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <span className="text-2xl font-medium">Dashboard</span>
    </div>
  );
}
