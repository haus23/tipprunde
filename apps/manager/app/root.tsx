import { FrownIcon } from "lucide-react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/root";
import faviconUrl from "./assets/favicon.ico?url";
import { Sidebar } from "./components/sidebar";
import { getSessionUser } from "./lib/auth.server";
import { getChampionshipBySlug, getLatestChampionship } from "./lib/championship.server";
import { championshipContext, userContext } from "./lib/context";
import { clearCookieHeader, cookieHeader, getCookie } from "./lib/cookies.server";
import { usePageTitle } from "./lib/utils";
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

export const meta: Route.MetaFunction = () => [{ tagName: "link", rel: "icon", href: faviconUrl }];

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

export function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  return { slug: championship?.slug, webAppUrl: webAppUrl() };
}

export function ErrorBoundary() {
  const error = useRouteError();

  const title = isRouteErrorResponse(error)
    ? `${error.status} – ${error.statusText}`
    : "Unerwarteter Fehler";

  const message = isRouteErrorResponse(error)
    ? String(error.data)
    : error instanceof Error
      ? error.message
      : "Ein unbekannter Fehler ist aufgetreten.";

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <FrownIcon className="text-error size-12" strokeWidth={1.5} />
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-subtle text-sm">{message}</p>
      {import.meta.env.DEV && error instanceof Error && error.stack && (
        <pre className="border-subtle bg-surface-raised text-muted max-h-64 max-w-2xl overflow-auto rounded-md border p-4 text-left text-xs">
          {error.stack}
        </pre>
      )}
      <Link to="/" className="text-sm underline underline-offset-4">
        Zurück zur Startseite
      </Link>
    </div>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  const { slug, webAppUrl } = loaderData;

  const pageTitle = usePageTitle();

  return (
    <div className="border-subtle mx-auto grid h-dvh w-full max-w-400 grid-cols-[208px_1fr] grid-rows-[56px_1fr] border-x">
      <Sidebar slug={slug} webAppUrl={webAppUrl} />
      <header className="border-subtle bg-surface-raised flex items-center justify-center border-b">
        {pageTitle && <span className="text-sm font-medium">{pageTitle}</span>}
      </header>
      <main className="overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
