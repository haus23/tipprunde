import { FrownIcon } from "lucide-react";
import { I18nProvider, RouterProvider } from "react-aria-components";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import faviconUrl from "./assets/favicon.ico?url";
import { COLOR_SCHEME_COOKIE, type ColorScheme } from "./lib/color-scheme";
import { userContext } from "./lib/context";
import { getCookie } from "./lib/cookies.server";
import { getSessionUser } from "./lib/session.server";

import "./app.css";

/**
 * Resolves the session for every route. Anonymous is fine here — the manager
 * layout adds the role requirement on top.
 */
const sessionMiddleware: Route.MiddlewareFunction = async ({ request, context }) => {
  context.set(userContext, await getSessionUser(request));
};

export const middleware: Route.MiddlewareFunction[] = [sessionMiddleware];

export const meta: Route.MetaFunction = () => [{ tagName: "link", rel: "icon", href: faviconUrl }];

export function Layout({ children }: { children: React.ReactNode }) {
  const loaderData = useRouteLoaderData<typeof loader>("root");
  const colorScheme = loaderData?.colorScheme ?? "system";

  return (
    <html lang="de" data-color-scheme={colorScheme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nProvider locale="de-DE">{children}</I18nProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function loader({ request, context }: Route.LoaderArgs) {
  const colorScheme = (getCookie(request, COLOR_SCHEME_COOKIE) ?? "system") as ColorScheme;
  return { colorScheme, user: context.get(userContext) };
}

/**
 * Last-resort boundary — public routes keep the shell via the public layout's
 * own boundary, so this mostly covers the manager and document-level failures.
 */
export function ErrorBoundary() {
  const error = useRouteError();

  // `statusText` is empty on thrown `data(...)` responses and defaults to
  // "Internal Server Error", which mislabels a 404. Derive the title instead.
  const title = isRouteErrorResponse(error)
    ? error.status === 404
      ? "Seite nicht gefunden"
      : error.status === 403
        ? "Kein Zugriff"
        : `Fehler ${error.status}`
    : "Etwas ist schiefgelaufen";

  // Route errors carry our own German copy; anything else is an internal
  // detail and must not reach visitors.
  const message = isRouteErrorResponse(error)
    ? typeof error.data === "string" && error.data
      ? error.data
      : "Diese Seite konnte nicht geladen werden."
    : "Bitte versuche es später noch einmal.";

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
      <a href="/" className="text-sm underline underline-offset-4">
        Zurück zur Startseite
      </a>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();

  // Lets React Aria's own links (cell links, menu items with href) navigate
  // client-side instead of triggering a document load.
  return (
    <RouterProvider navigate={(to, options) => void navigate(to, options)}>
      <Outlet />
    </RouterProvider>
  );
}
