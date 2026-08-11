import { redirect } from "react-router";

import { championshipContext } from "#/lib/context.ts";

import type { Route } from "./+types/index";

export function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  throw redirect(championship ? `/manager/${championship.slug}` : "/manager/start");
}
