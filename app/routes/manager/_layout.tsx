import { Outlet, redirect } from "react-router";
import { HinterhofNav } from "~/components/manager/nav";
import { AppHeader } from "~/components/shell/app-header";
import { AppInset } from "~/components/shell/app-inset";
import { AppSidebar } from "~/components/shell/app-sidebar";
import type { Route } from "./+types/_layout";
import { userContext } from "~/lib/auth/user.context";
import { isManager } from "~/lib/auth/permissions";
import { championshipContext } from "~/lib/manager/championship.context";
import {
  getChampionshipById,
  getLatestChampionship,
} from "~/lib/db/championships";
import { CurrentChampionshipProvider } from "~/lib/manager/use-current-championship";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context }) => {
    const user = context.get(userContext);
    if (!isManager(user)) {
      throw redirect("/login");
    }
  },
  async ({ context, params }) => {
    const championship = params.championshipId
      ? getChampionshipById(params.championshipId)
      : getLatestChampionship();

    if (!championship) {
      throw new Response("Championship not found", { status: 404 });
    }

    context.set(championshipContext, championship);
  },
];

export async function loader({ context, params }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  // Track whether championshipId was explicitly in the URL
  const hasExplicitChampionship = !!params.championshipId;
  return { championship, hasExplicitChampionship };
}

export default function HinterhofLayout({ loaderData }: Route.ComponentProps) {
  return (
    <CurrentChampionshipProvider
      championship={loaderData.championship}
      hasExplicitChampionship={loaderData.hasExplicitChampionship}
    >
      <title>Hinterhof - runde.tips</title>
      <meta name="description" content="Verwaltung der Haus23 Tipprunde" />
      <AppSidebar>
        <HinterhofNav />
      </AppSidebar>
      <AppInset>
        <AppHeader>{null}</AppHeader>
        <Outlet />
      </AppInset>
    </CurrentChampionshipProvider>
  );
}
