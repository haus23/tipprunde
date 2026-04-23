import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { CompositeComponent, createCompositeComponent } from "@tanstack/react-start/rsc";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { motion } from "motion/react";

import { requireManager } from "#/app/(auth)/guards.ts";
import { fetchChampionshipsFn } from "#/app/manager/championships.ts";
import { getManagerShellSettingsFn } from "#/app/settings/manager-shell.ts";
import { ColorSchemeSwitch } from "#/components/color-scheme-switch.tsx";
import { ChampionshipSwitcher } from "#/components/manager/championship-switcher.tsx";
import { ShellProvider, useShell } from "#/components/manager/shell-provider.tsx";
import { MobileNav, Sidebar, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "#/components/manager/sidebar.tsx";
import { getChampionship, getLatestChampionship } from "#db/dal/championships.ts";

const transition = { type: "spring", bounce: 0, duration: 0.3 } as const;

type ShellProps = {
  slug: string | undefined;
  currentChampionship: Awaited<ReturnType<typeof getChampionship>>;
  children?: React.ReactNode;
};

const getServerShell = createServerFn()
  .inputValidator((data: { slug: string | undefined }) => data)
  .handler(async ({ data: { slug } }) => {
    const championship = slug ? await getChampionship(slug) : await getLatestChampionship();

    const src = await createCompositeComponent(
      (props: { ServerShell: React.ComponentType<ShellProps>; children?: React.ReactNode }) => (
        <props.ServerShell currentChampionship={championship} slug={slug}>
          {props.children}
        </props.ServerShell>
      ),
    );

    return { src };
  });

type RouteContext = {
  slug: string | undefined;
  championships: Awaited<ReturnType<typeof fetchChampionshipsFn>>;
};

export const Route = createFileRoute("/manager")({
  beforeLoad: async ({ matches }): Promise<RouteContext> => {
    await requireManager();

    const params = matches.at(-1)?.params;
    const slug = params && "slug" in params ? params.slug : undefined;

    const championships = await fetchChampionshipsFn();

    return { championships, slug };
  },
  loader: async ({ context: { slug } }) => {
    const [serverShell, shellSettings] = await Promise.all([
      getServerShell({ data: { slug } }),
      getManagerShellSettingsFn(),
    ]);
    return { serverShell, shellSettings };
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
          className="border-layout fixed top-0 right-0 z-10 flex h-14 items-center justify-between border-b px-4"
        >
          <div className="flex items-center gap-3">
            {/* Mobile: open drawer */}
            <button
              onClick={toggleMobileMenu}
              className="hover:bg-subtle text-subtle focus-visible:ring-focus rounded-md p-1 outline-none focus-visible:ring-2 md:hidden"
              aria-label="Navigation öffnen"
            >
              <PanelLeftOpenIcon size={16} />
            </button>
            {/* Desktop: collapse toggle */}
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
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium">
              {pageTitle}
            </span>
          )}

          <ColorSchemeSwitch />
        </motion.header>

        <main className="flex-1 pt-14">
          <div className="px-2 py-4 xs:px-4 xs:py-6 sm:p-8">{children}</div>
        </main>
      </motion.div>
    </div>
  );
}

function RouteComponent() {
  const { serverShell, shellSettings } = Route.useLoaderData();
  return (
    <ShellProvider initialSidebarCollapsed={shellSettings.sidebarCollapsed}>
      <CompositeComponent src={serverShell.src} ServerShell={ManagerShell}>
        <Outlet />
      </CompositeComponent>
    </ShellProvider>
  );
}
