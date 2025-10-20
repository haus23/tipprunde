import { Outlet } from "react-router";
import { AppShell } from "~/components/shell/app-shell";
import { AppSidebar } from "~/components/shell/app-sidebar";

export default function FohLayout() {
  return (
    <AppShell>
      <AppSidebar>
        <></>
      </AppSidebar>
      <Outlet />
    </AppShell>
  );
}
