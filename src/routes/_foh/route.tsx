import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";
import { FohNav } from "./-nav";

export const Route = createFileRoute("/_foh")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AppSidebar>
        <FohNav />
      </AppSidebar>
      <AppInset>
        <AppHeader>Header</AppHeader>
        <Outlet />
      </AppInset>
    </>
  );
}
