import { data, Outlet } from "react-router";

import { ManagerErrorContent } from "#/components/manager-error.tsx";
import { getChampionshipBySlug } from "#/lib/championship.server.ts";
import { championshipContext } from "#/lib/context.ts";
import { cookieHeader } from "#/lib/cookies.server.ts";

import type { Route } from "./+types/_layout";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ params, context }, next) => {
    const slug = params.slug;
    const current = context.get(championshipContext);

    if (current?.slug === slug) return next();

    const championship = await getChampionshipBySlug(slug);
    // An unknown slug is 404'd by the loader below, not here: an error thrown
    // from middleware bypasses this route's ErrorBoundary and loses the shell.
    if (!championship) return next();

    context.set(championshipContext, championship);

    const response = await next();
    response.headers.append("Set-Cookie", cookieHeader("__championship", slug));
    return response;
  },
];

/**
 * The middleware leaves the context on the layout's fallback championship when
 * the slug resolves to nothing, so a mismatch here means the slug is unknown.
 */
export function loader({ params, context }: Route.LoaderArgs) {
  if (context.get(championshipContext)?.slug !== params.slug) {
    throw data(null, { status: 404 });
  }
  return null;
}

export const ErrorBoundary = ManagerErrorContent;

export default function Championship() {
  return <Outlet />;
}
