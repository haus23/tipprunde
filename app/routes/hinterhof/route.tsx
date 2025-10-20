import { Outlet } from "react-router";
import { AppShell } from "~/components/shell/app-shell";
import { AppSidebar } from "~/components/shell/app-sidebar";
import { HinterhofNav } from "./nav";

export default function HinterhofLayout() {
  return (
    <AppShell>
      <title>Hinterhof - runde.tips</title>
      <meta name="description" content="Verwaltung der Haus23 Tipprunde" />
      <AppSidebar>
        <HinterhofNav />
      </AppSidebar>
      <Outlet />
    </AppShell>
  );
}
