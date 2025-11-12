import { Outlet, redirect } from "react-router";
import { HinterhofNav } from "~/components/hinterhof/nav";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";
import type { Route } from "./+types/_layout";
import { userContext } from "~/lib/auth/user.context";
import { isManager } from "~/lib/auth/permissions";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context }) => {
    const user = context.get(userContext);
    if (!isManager(user)) {
      throw redirect("/login");
    }
  },
];

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
