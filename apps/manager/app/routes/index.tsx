import { redirect } from "react-router";

import { championshipContext } from "../lib/context";
import type { Route } from "./+types/index";

export function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  throw redirect(championship ? `/${championship.slug}` : "/start");
}
