import { Button } from "@tipprunde/ui";
import { cx } from "@tipprunde/ui";
import {
  FrownIcon,
  MenuIcon,
  MoonIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  SunIcon,
} from "lucide-react";
import { Suspense, useEffect } from "react";
import { I18nProvider } from "react-aria-components";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  redirect,
  useFetcher,
  useRouteError,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import faviconUrl from "./assets/favicon.ico?url";
import { ChampionshipSwitcher } from "./components/championship-switcher";
import { MobileNav } from "./components/mobile-nav";
import { ShellProvider, useShell } from "./components/shell-provider";
import { Sidebar } from "./components/sidebar";
import { getSessionUser } from "./lib/auth.server";
import {
  getChampionshipBySlug,
  getChampionships,
  getLatestChampionship,
} from "./lib/championship.server";
import { championshipContext, userContext } from "./lib/context";
import { clearCookieHeader, cookieHeader, getCookie } from "./lib/cookies.server";
import { usePageTitle } from "./lib/utils";
import { webAppUrl } from "./lib/web-app.server";

import "./app.css";

type ColorScheme = "system" | "light" | "dark";

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

export function loader({ context, request }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const colorScheme = (getCookie(request, "__color-scheme") ?? "system") as ColorScheme;
  const sidebarCollapsed = getCookie(request, "__manager-sidebar") === "true";
  return {
    slug: championship?.slug,
    name: championship?.name,
    webAppUrl: webAppUrl(),
    colorScheme,
    sidebarCollapsed,
    championships: getChampionships(),
  };
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
      <a href="/manager" className="text-sm underline underline-offset-4">
        Zurück zur Startseite
      </a>
    </div>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  return (
    <ShellProvider initialSidebarCollapsed={loaderData.sidebarCollapsed}>
      <Shell loaderData={loaderData} />
    </ShellProvider>
  );
}

function Shell({ loaderData }: { loaderData: Route.ComponentProps["loaderData"] }) {
  const { slug, name, webAppUrl, colorScheme, championships } = loaderData;
  const pageTitle = usePageTitle();
  const fetcher = useFetcher();
  const { isSidebarCollapsed, toggleSidebar, toggleMobileMenu } = useShell();

  const pendingScheme = fetcher.formData?.get("scheme") as ColorScheme | undefined;

  // Optimistic: immediately update <html> before the loader revalidates
  useEffect(() => {
    if (pendingScheme) {
      document.documentElement.setAttribute("data-color-scheme", pendingScheme);
    }
  }, [pendingScheme]);

  const handleToggle = () => {
    const isDark =
      colorScheme === "dark" ||
      (colorScheme === "system" &&
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    void fetcher.submit(
      { scheme: isDark ? "light" : "dark" },
      { method: "post", action: "/color-scheme" },
    );
  };

  return (
    <div
      className={cx(
        "border-subtle isolate mx-auto grid h-dvh w-full max-w-400 grid-cols-[1fr] grid-rows-[56px_1fr] border-x transition-[grid-template-columns] duration-300 ease-out",
        isSidebarCollapsed ? "md:grid-cols-[56px_1fr]" : "md:grid-cols-[208px_1fr]",
      )}
    >
      <Sidebar slug={slug} webAppUrl={webAppUrl} />
      <MobileNav slug={slug} webAppUrl={webAppUrl} />
      <header className="border-subtle bg-surface-raised flex items-center gap-1 border-b px-4">
        <Button
          intent="ghost"
          size="icon"
          onPress={toggleMobileMenu}
          aria-label="Navigation öffnen"
          className="md:hidden"
        >
          <MenuIcon className="size-4" />
        </Button>
        <Button
          intent="ghost"
          size="icon"
          onPress={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
          className="hidden md:inline-flex"
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpenIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <Suspense fallback={<div className="flex-1" />}>
          <ChampionshipSwitcher
            current={slug && name ? { slug, name } : null}
            championships={championships}
          />
        </Suspense>
        {pageTitle && <h1 className="hidden text-sm font-medium sm:block">{pageTitle}</h1>}
        <div className="flex flex-1 justify-end">
          <Button
            intent="ghost"
            size="icon"
            onPress={handleToggle}
            aria-label="Farbschema wechseln"
          >
            <MoonIcon className="hidden size-4 dark:block" />
            <SunIcon className="block size-4 dark:hidden" />
          </Button>
        </div>
      </header>
      <main className="relative overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
