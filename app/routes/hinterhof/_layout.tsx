import { Outlet } from "react-router";
import { HinterhofNav } from "~/components/hinterhof/nav";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";

export default function HinterhofLayout() {
  return (
    <>
      <title>Hinterhof - runde.tips</title>
      <meta name="description" content="Verwaltung der Haus23 Tipprunde" />
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
