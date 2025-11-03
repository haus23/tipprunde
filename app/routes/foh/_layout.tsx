import { Outlet } from "react-router";
import { FohNav } from "~/components/foh/nav";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";

export default function FohLayout() {
  return (
    <>
      <AppSidebar>
        <FohNav />
      </AppSidebar>
      <AppInset>
        <AppHeader>{null}</AppHeader>
        <Outlet />
      </AppInset>
    </>
  );
}
