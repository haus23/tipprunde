import { Links, Meta, Outlet, Scripts, ScrollRestoration, redirect } from "react-router";

import type { Route } from "./+types/root";
import { getSessionUser } from "./lib/auth.server";
import { getChampionshipBySlug, getLatestChampionship } from "./lib/championship.server";
import { championshipContext, userContext } from "./lib/context";
import { clearCookieHeader, cookieHeader, getCookie } from "./lib/cookies.server";

import "./app.css";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }, next) => {
    const user = await getSessionUser(request);
    if (!user) throw redirect("/login");
    context.set(userContext, user);

    const cookieSlug = getCookie(request, "__championship");
    let championship = cookieSlug ? await getChampionshipBySlug(cookieSlug) : null;
    if (!championship) championship = (await getLatestChampionship()) ?? null;

    context.set(championshipContext, championship!);

    const response = await next();

    if (championship && championship.slug !== cookieSlug) {
      response.headers.append("Set-Cookie", cookieHeader("__championship", championship.slug));
    } else if (!championship) {
      response.headers.append("Set-Cookie", clearCookieHeader("__championship"));
    }

    return response;
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
