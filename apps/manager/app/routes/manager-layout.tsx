import { Button } from "@tipprunde/ui";
import { cx } from "@tipprunde/ui";
import { MenuIcon, MoonIcon, PanelLeftCloseIcon, PanelLeftOpenIcon, SunIcon } from "lucide-react";
import { Suspense, useEffect } from "react";
import { data, Outlet, redirect, useFetcher, useRouteLoaderData } from "react-router";

import { ChampionshipSwitcher } from "#/components/championship-switcher.tsx";
import { MobileNav } from "#/components/mobile-nav.tsx";
import { ShellProvider, useShell } from "#/components/shell-provider.tsx";
import { Sidebar } from "#/components/sidebar.tsx";
import {
  getChampionshipBySlug,
  getChampionships,
  getLatestChampionship,
} from "#/lib/championship.server.ts";
import type { ColorScheme } from "#/lib/color-scheme.ts";
import { championshipContext, userContext } from "#/lib/context.ts";
import { clearCookieHeader, cookieHeader, getCookie } from "#/lib/cookies.server.ts";
import { isManager } from "#/lib/session.server.ts";
import { usePageTitle } from "#/lib/utils.ts";

import type { loader as rootLoader } from "../root";
import type { Route } from "./+types/manager-layout";

/** The session itself is resolved by the root middleware — this only gates on role. */
const authMiddleware: Route.MiddlewareFunction = ({ request, context }) => {
  const user = context.get(userContext);
  if (!user) {
    const { pathname, search } = new URL(request.url);
    throw redirect(`/login?redirectTo=${encodeURIComponent(pathname + search)}`);
  }
  if (!isManager(user)) throw data("Kein Zugriff auf den Manager.", { status: 403 });
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

export function loader({ context, request }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const sidebarCollapsed = getCookie(request, "__manager-sidebar") === "true";
  return {
    slug: championship?.slug,
    name: championship?.name,
    sidebarCollapsed,
    championships: getChampionships(),
  };
}

export default function ManagerLayout({ loaderData }: Route.ComponentProps) {
  return (
    <ShellProvider initialSidebarCollapsed={loaderData.sidebarCollapsed}>
      <Shell loaderData={loaderData} />
    </ShellProvider>
  );
}

function Shell({ loaderData }: { loaderData: Route.ComponentProps["loaderData"] }) {
  const { slug, name, championships } = loaderData;
  const colorScheme = useRouteLoaderData<typeof rootLoader>("root")?.colorScheme ?? "system";
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
      <Sidebar slug={slug} />
      <MobileNav slug={slug} />
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
