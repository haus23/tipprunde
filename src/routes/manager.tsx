import { createFileRoute, Outlet, redirect, useMatches } from "@tanstack/react-router";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

import { requireManager } from "#/app/(auth)/guards.ts";
import {
  fetchChampionshipsFn,
  fetchCurrentChampionshipFn,
} from "#/app/manager/championships.ts";
import { getManagerShellSettingsFn } from "#/app/settings/manager-shell.ts";
import { ColorSchemeSwitch } from "#/components/color-scheme-switch.tsx";
import { ChampionshipSwitcher } from "#/components/manager/championship-switcher.tsx";
import { ShellProvider, useShell } from "#/components/manager/shell-provider.tsx";
import {
  MobileNav,
  Sidebar,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
} from "#/components/manager/sidebar.tsx";

const transition = { type: "spring", bounce: 0, duration: 0.3 } as const;

type ShellProps = {
  slug: string | undefined;
  currentChampionship: Awaited<ReturnType<typeof fetchCurrentChampionshipFn>>;
  children?: React.ReactNode;
};

type RouteContext = {
  slug: string | undefined;
  championships: Awaited<ReturnType<typeof fetchChampionshipsFn>>;
  shellSettings: Awaited<ReturnType<typeof getManagerShellSettingsFn>>;
};

export const Route = createFileRoute("/manager")({
  beforeLoad: async ({ matches, location }): Promise<RouteContext> => {
    await requireManager();

    const params = matches.at(-1)?.params;
    const urlSlug = params && "slug" in params ? params.slug : undefined;

    const [championships, shellSettings] = await Promise.all([
      fetchChampionshipsFn(),
      getManagerShellSettingsFn(),
    ]);

    const { activeSlug } = shellSettings;
    if (location.pathname === "/manager" && activeSlug && activeSlug !== championships[0]?.slug) {
      throw redirect({ to: "/manager/{-$slug}", params: { slug: activeSlug } });
    }

    const slug = urlSlug ?? activeSlug;

    return { championships, slug, shellSettings };
  },
  loader: async ({ context: { slug, shellSettings } }) => {
    const currentChampionship = await fetchCurrentChampionshipFn({ data: slug });
    return { currentChampionship, shellSettings };
  },
  component: RouteComponent,
});

function ManagerShell({ currentChampionship, slug, children }: ShellProps) {
  const { championships } = Route.useRouteContext();
  const matches = useMatches();
  const { isSidebarCollapsed, toggleSidebar, toggleMobileMenu } = useShell();

  const [isMd, setIsMd] = useState(true);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsMd(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMd(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const pageTitle = matches
    .map((m) => (m.context as { pageTitle?: string }).pageTitle)
    .filter(Boolean)
    .at(-1);

  const sidebarOffset = isMd ? (isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH) : 0;

  return (
    <div className="flex min-h-svh">
      <Sidebar slug={slug} />
      <MobileNav slug={slug} />

      <motion.div
        animate={{ marginLeft: sidebarOffset }}
        transition={transition}
        className="flex flex-1 flex-col"
      >
        <motion.header
          animate={{ left: sidebarOffset }}
          transition={transition}
          className="border-layout bg-base fixed top-0 right-0 z-10 flex h-14 items-center justify-between border-b px-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={toggleMobileMenu}
              className="hover:bg-subtle text-subtle focus-visible:ring-focus rounded-md p-1 outline-none focus-visible:ring-2 md:hidden"
              aria-label="Navigation öffnen"
            >
              <PanelLeftOpenIcon size={16} />
            </button>
            <button
              onClick={toggleSidebar}
              className="hover:bg-subtle text-subtle focus-visible:ring-focus hidden rounded-md p-1 outline-none focus-visible:ring-2 md:block"
              aria-label={isSidebarCollapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpenIcon size={16} />
              ) : (
                <PanelLeftCloseIcon size={16} />
              )}
            </button>
            {currentChampionship && (
              <ChampionshipSwitcher current={currentChampionship} championships={championships} />
            )}
          </div>

          {pageTitle && (
            <span className="absolute left-1/2 hidden -translate-x-1/2 text-sm font-medium md:block">
              {pageTitle}
            </span>
          )}

          <ColorSchemeSwitch />
        </motion.header>

        <main className="flex-1 pt-14">
          <div className="xs:px-4 xs:py-6 px-2 py-4 sm:p-8">{children}</div>
        </main>
      </motion.div>
    </div>
  );
}

function RouteComponent() {
  const { slug } = Route.useRouteContext();
  const { currentChampionship, shellSettings } = Route.useLoaderData();
  return (
    <ShellProvider initialSidebarCollapsed={shellSettings.sidebarCollapsed}>
      <ManagerShell currentChampionship={currentChampionship} slug={slug}>
        <Outlet />
      </ManagerShell>
    </ShellProvider>
  );
}
