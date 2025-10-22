import { Outlet } from "react-router";
import { AppShell } from "~/components/shell/app-shell";
import { AppSidebar } from "~/components/shell/app-sidebar";
import { HinterhofNav } from "./nav";
import { userContext } from "~/utils/user.server";
import { redirect } from "react-router";

import type { Route } from "./+types/route";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context }) => {
    const user = context.get(userContext);
    if (!user || !user.isManager) {
      throw redirect("/login");
    }
  },
];

export function loader() {
  return null;
}

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
