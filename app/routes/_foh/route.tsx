import { Outlet } from "react-router";
import { AppShell } from "~/components/shell/app-shell";
import { AppSidebar } from "~/components/shell/app-sidebar";
import { FohNav } from "./nav";

export default function FohLayout() {
  return (
    <AppShell>
      <AppSidebar>
        <FohNav />
      </AppSidebar>
      <Outlet />
    </AppShell>
  );
}
