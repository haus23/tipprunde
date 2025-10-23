import { Outlet } from "react-router";
import { AppShell } from "~/components/shell/app-shell";
import { AppSidebar } from "~/components/shell/app-sidebar";
import { HinterhofNav } from "./nav";
import { userContext } from "~/utils/user.server";
import { redirect } from "react-router";

import type { Route } from "./+types/route";
import { URL, URLSearchParams } from "url";
import { createPath } from "react-router";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context, request }) => {
    const user = context.get(userContext);
    if (!user || !user.isManager) {
      // TODO: validate the redirectUrl handling here and in the auth-methods.
      const url = new URL(request.url);
      const requestedPath = encodeURIComponent(url.pathname + url.search);
      const redirectUrl = createPath({
        pathname: "/login",
        search: new URLSearchParams({ redirectTo: requestedPath }).toString(),
      });
      throw redirect(redirectUrl);
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
