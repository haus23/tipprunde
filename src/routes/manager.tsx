import { createFileRoute, Outlet } from "@tanstack/react-router";

import { requireManager } from "#/app/(auth)/guards.ts";

export const Route = createFileRoute("/manager")({
  beforeLoad: async () => {
    await requireManager();
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <p>Manager Layout</p>
      <Outlet />
    </div>
  );
}
