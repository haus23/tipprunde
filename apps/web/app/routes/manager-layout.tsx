import { Button } from "@tipprunde/ui";
import { cx } from "@tipprunde/ui";
import { MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { Suspense } from "react";
import { data, Outlet, redirect } from "react-router";

import { ChampionshipSwitcher } from "#/components/championship-switcher.tsx";
import { ColorSchemeToggle } from "#/components/color-scheme-toggle.tsx";
import { MobileNav } from "#/components/mobile-nav.tsx";
import { ShellProvider, useShell } from "#/components/shell-provider.tsx";
import { Sidebar } from "#/components/sidebar.tsx";
import {
  getChampionshipBySlug,
  getChampionships,
  getLatestChampionship,
} from "#/lib/championship.server.ts";
import { championshipContext, userContext } from "#/lib/context.ts";
import { clearCookieHeader, cookieHeader, getCookie } from "#/lib/cookies.server.ts";
import { isManager } from "#/lib/session.server.ts";
import { usePageTitle } from "#/lib/utils.ts";

import type { Route } from "./+types/manager-layout";

/** The session itself is resolved by the root middleware — this only gates on role. */
const authMiddleware: Route.MiddlewareFunction = ({ url, context }) => {
  const user = context.get(userContext);
  if (!user) {
    // `url` is normalized; `request.url` would still carry the `.data` suffix
    // on client-side navigations and send the user to a dead path after login.
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname + url.search)}`);
  }
  // The 403 is *not* thrown here: a `data()` thrown from middleware short-circuits
  // as a raw response body and never reaches an ErrorBoundary. The loader below
  // throws it instead, where it becomes a proper ErrorResponse.
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
  if (!isManager(context.get(userContext))) {
    throw data("Kein Zugriff auf den Manager.", { status: 403 });
  }

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
  const pageTitle = usePageTitle();
  const { isSidebarCollapsed, toggleSidebar, toggleMobileMenu } = useShell();

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
          <ColorSchemeToggle />
        </div>
      </header>
      <main className="relative overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
