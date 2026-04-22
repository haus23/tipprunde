import { createFileRoute, Outlet, useMatches } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { CompositeComponent, createCompositeComponent } from "@tanstack/react-start/rsc";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { motion } from "motion/react";

import { requireManager } from "#/app/(auth)/guards.ts";
import {
  fetchChampionshipsFn,
  fetchCurrentChampionshipFn,
} from "#/app/manager/championships.ts";
import { getManagerShellSettingsFn } from "#/app/settings/manager-shell.ts";
import { ColorSchemeSwitch } from "#/components/color-scheme-switch.tsx";
import { ChampionshipSwitcher } from "#/components/manager/championship-switcher.tsx";
import { Sidebar, SIDEBAR_WIDTH, SIDEBAR_WIDTH_COLLAPSED } from "#/components/manager/sidebar.tsx";
import { ShellProvider, useShell } from "#/components/manager/shell-provider.tsx";

const transition = { type: "spring", bounce: 0, duration: 0.3 } as const;

type ShellProps = {
  name: string;
  slug: string | undefined;
  championships: { slug: string; name: string }[];
  children?: React.ReactNode;
};

const getManagerLayout = createServerFn()
  .inputValidator((data: { slug: string | undefined }) => data)
  .handler(async ({ data: { slug } }) => {
    const [championship, championships] = await Promise.all([
      fetchCurrentChampionshipFn({ data: slug }),
      fetchChampionshipsFn(),
    ]);

    const src = await createCompositeComponent(
      (props: { Shell: React.ComponentType<ShellProps>; children?: React.ReactNode }) => (
        <props.Shell
          name={championship?.name ?? ""}
          slug={slug}
          championships={championships}
        >
          {props.children}
        </props.Shell>
      ),
    );

    return { src };
  });

export const Route = createFileRoute("/manager")({
  beforeLoad: async ({ matches }): Promise<{ slug: string | undefined }> => {
    await requireManager();

    const params = matches.at(-1)?.params;
    const slug = params && "slug" in params ? params.slug : undefined;

    return { slug };
  },
  loader: async ({ context: { slug } }) => {
    const [Layout, shellSettings] = await Promise.all([
      getManagerLayout({ data: { slug } }),
      getManagerShellSettingsFn(),
    ]);
    return { Layout, shellSettings };
  },
  component: RouteComponent,
});

function ManagerShell({ name, slug, championships, children }: ShellProps) {
  const { isSidebarCollapsed, toggleSidebar } = useShell();
  const matches = useMatches();

  const pageTitle = matches
    .map((m) => (m.context as { pageTitle?: string }).pageTitle)
    .filter(Boolean)
    .at(-1);

  return (
    <div className="flex min-h-svh">
      <Sidebar slug={slug} />

      <motion.div
        animate={{ marginLeft: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
        transition={transition}
        className="flex flex-1 flex-col"
      >
        <motion.header
          animate={{ left: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
          transition={transition}
          className="border-layout fixed top-0 right-0 z-10 flex h-14 items-center justify-between border-b px-4"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="hover:bg-subtle text-subtle rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-focus"
              aria-label={isSidebarCollapsed ? "Sidebar ausklappen" : "Sidebar einklappen"}
            >
              {isSidebarCollapsed ? <PanelLeftOpenIcon size={16} /> : <PanelLeftCloseIcon size={16} />}
            </button>
            <ChampionshipSwitcher current={{ name, slug }} championships={championships} />
          </div>

          {pageTitle && (
            <span className="absolute left-1/2 -translate-x-1/2 text-sm font-medium">
              {pageTitle}
            </span>
          )}

          <ColorSchemeSwitch />
        </motion.header>

        <main className="flex-1 pt-14">
          <div className="p-8">{children}</div>
        </main>
      </motion.div>
    </div>
  );
}

function RouteComponent() {
  const { Layout, shellSettings } = Route.useLoaderData();
  return (
    <ShellProvider initialSidebarCollapsed={shellSettings.sidebarCollapsed}>
      <CompositeComponent src={Layout.src} Shell={ManagerShell}>
        <Outlet />
      </CompositeComponent>
    </ShellProvider>
  );
}
