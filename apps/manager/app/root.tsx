import { Links, Meta, Outlet, Scripts, ScrollRestoration, redirect } from "react-router";

import type { Route } from "./+types/root";
import { Sidebar } from "./components/sidebar";
import { getSessionUser } from "./lib/auth.server";
import { getChampionshipBySlug, getLatestChampionship } from "./lib/championship.server";
import { championshipContext, userContext } from "./lib/context";
import { clearCookieHeader, cookieHeader, getCookie } from "./lib/cookies.server";
import { webAppUrl } from "./lib/web-app.server";

import "./app.css";

const authMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
  const user = await getSessionUser(request);
  if (!user) throw redirect(webAppUrl("/login"));
  context.set(userContext, user);
};

const championshipMiddleware: Route.MiddlewareFunction = async ({ request, context }, next) => {
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
};

export const middleware: Route.MiddlewareFunction[] = [authMiddleware, championshipMiddleware];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href={`${import.meta.env.BASE_URL}favicon.ico`} />
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

export function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  return { slug: championship?.slug, webAppUrl: webAppUrl() };
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { slug, webAppUrl } = loaderData;
  return (
    <div className="grid h-dvh grid-cols-[208px_1fr] grid-rows-[56px_1fr]">
      <Sidebar slug={slug} webAppUrl={webAppUrl} />
      <header className="border-subtle bg-surface-raised border-b" />
      <main className="overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
