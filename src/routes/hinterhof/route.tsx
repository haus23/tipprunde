import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";
import { HinterhofNav } from "./-nav";

export const Route = createFileRoute("/hinterhof")({
  head: () => ({
    meta: [
      {
        title: "Hinterhof - runde.tips",
      },
      {
        name: "description",
        content: "Verwaltung",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <AppSidebar>
        <HinterhofNav />
      </AppSidebar>
      <AppInset>
        <AppHeader>{null}</AppHeader>
        <Outlet />
      </AppInset>
    </>
  );
}
