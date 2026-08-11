import { Outlet } from "react-router";

import { getPublishedChampionship } from "#/lib/championship.server.ts";
import { publicChampionshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/_championship-layout";

/**
 * Pathless layout for the public championship views. Resolves the currently
 * published championship once, so the pages below don't each look it up.
 */
const championshipMiddleware: Route.MiddlewareFunction = async ({ context }) => {
  context.set(publicChampionshipContext, (await getPublishedChampionship()) ?? null);
};

export const middleware: Route.MiddlewareFunction[] = [championshipMiddleware];

export default function ChampionshipLayout() {
  return <Outlet />;
}
