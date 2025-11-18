import { Outlet, redirect } from "react-router";

import { ManagerNav } from "~/components/manager/nav";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";
import { MobileSidebar } from "~/components/shell/mobile-sidebar";
import { userContext } from "~/lib/auth/user.context";
import { isManager } from "~/lib/auth/permissions";
import {
  getChampionshipById,
  getLatestChampionship,
} from "~/lib/db/championships";
import { ChampionshipProvider } from "~/lib/manager/use-championship";

import type { Route } from "./+types/_layout";
import { ManagerHeader } from "~/components/manager/header";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context }) => {
    const user = context.get(userContext);
    if (!isManager(user)) {
      throw redirect("/login");
    }
  },
];

export async function loader({ params }: Route.LoaderArgs) {
  const loaderChampionship = params.championshipId
    ? getChampionshipById(params.championshipId)
    : getLatestChampionship();

  return { loaderChampionship };
}

export default function ManagerLayout({ loaderData }: Route.ComponentProps) {
  return (
    <ChampionshipProvider loaderChampionship={loaderData.loaderChampionship}>
      <title>Hinterhof - runde.tips</title>
      <meta name="description" content="Verwaltung der Haus23 Tipprunde" />
      <AppSidebar>
        <ManagerNav />
      </AppSidebar>
      <MobileSidebar>
        <ManagerNav />
      </MobileSidebar>
      <AppInset>
        <AppHeader>
          <ManagerHeader />
        </AppHeader>
        <Outlet />
      </AppInset>
    </ChampionshipProvider>
  );
}
