import { data, Outlet } from "react-router";

import { getChampionshipBySlug } from "../lib/championship.server";
import { championshipContext } from "../lib/context";
import { cookieHeader } from "../lib/cookies.server";
import type { Route } from "./+types/championship";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ params, context }, next) => {
    const slug = params.slug;
    const current = context.get(championshipContext);

    if (current?.slug === slug) return next();

    const championship = await getChampionshipBySlug(slug);
    if (!championship) throw data(null, { status: 404 });

    context.set(championshipContext, championship);

    const response = await next();
    response.headers.append("Set-Cookie", cookieHeader("__championship", slug));
    return response;
  },
];

export default function Championship() {
  return <Outlet />;
}
