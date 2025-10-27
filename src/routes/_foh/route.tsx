import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";

export const Route = createFileRoute("/_foh")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AppSidebar>Nav</AppSidebar>
      <AppInset>
        <AppHeader>Header</AppHeader>
        <Outlet />
      </AppInset>
    </>
  );
}
