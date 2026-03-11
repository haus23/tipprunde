import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/")({
  head: () => ({
    meta: [{ title: "Dashboard | Manager" }],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  return (
    <div>
      <h1 className="text-2xl font-medium">Dashboard</h1>
    </div>
  );
}
