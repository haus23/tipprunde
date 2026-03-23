import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { ChampionshipSwitcher } from "@/components/manager/championship-switcher.tsx";
import { FoldersIcon, LayoutDashboardIcon, PilcrowIcon, ShieldIcon, ShirtIcon, TrophyIcon, UsersIcon } from "lucide-react";
import { Logo } from "@/components/logo.tsx";
import { requireManager } from "@/lib/auth/functions.ts";
import { fetchChampionships, fetchCurrentChampionship } from "@/lib/championships.ts";
import type { Championship } from "@/lib/championships.ts";

export const Route = createFileRoute("/manager")({
  beforeLoad: async () => {
    const user = await requireManager();
    const [championships, currentChampionship] = await Promise.all([
      fetchChampionships(),
      fetchCurrentChampionship(),
    ]);
    return { user, championships, currentChampionship };
  },
  component: ManagerLayout,
});

function ManagerLayout() {
  const { championships, currentChampionship: initialChampionship } = Route.useRouteContext();
  const matches = useMatches();

  // Championship from active $slug route context (always fresh, takes priority)
  const slugChampionship = matches
    .map((m) => (m.context as { currentChampionship?: Championship }).currentChampionship)
    .filter(Boolean)
    .at(-1);

  const currentChampionship = slugChampionship ?? initialChampionship;

  const pageTitle = matches
    .map((m) => (m.context as { pageTitle?: string }).pageTitle)
    .filter(Boolean)
    .at(-1);

  const headerTitle = pageTitle ?? currentChampionship?.name ?? "Manager";

  return (
    <div className="flex min-h-svh">
      <aside className="border-layout fixed inset-y-0 left-0 hidden w-52 flex-col overflow-y-auto border-r md:flex">
        <div className="flex h-14 shrink-0 items-center px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-10">
              <Logo />
            </span>
            <span className="text-lg font-medium">runde.tips</span>
          </Link>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {currentChampionship ? (
            <Link
              to="/manager/$slug"
              params={{ slug: currentChampionship.slug }}
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
            >
              <LayoutDashboardIcon size={16} />
              Dashboard
            </Link>
          ) : (
            <Link
              to="/manager"
              activeOptions={{ exact: true }}
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
            >
              <LayoutDashboardIcon size={16} />
              Dashboard
            </Link>
          )}

          {currentChampionship && (
            <Link
              to="/manager/$slug/turnier"
              params={{ slug: currentChampionship.slug }}
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <TrophyIcon size={16} />
              Turnier
            </Link>
          )}

          <div className="mt-auto flex flex-col gap-1">
            <div className="text-subtle px-3 py-1 text-xs font-medium tracking-wide uppercase">
              Stammdaten
            </div>
            <Link
              to="/manager/stammdaten/regelwerke"
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <PilcrowIcon size={16} />
              Regelwerke
            </Link>
            <Link
              to="/manager/stammdaten/turniere"
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <FoldersIcon size={16} />
              Turniere
            </Link>
            <Link
              to="/manager/stammdaten/ligen"
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <ShieldIcon size={16} />
              Ligen
            </Link>
            <Link
              to="/manager/stammdaten/teams"
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <ShirtIcon size={16} />
              Teams
            </Link>
            <Link
              to="/manager/stammdaten/spieler"
              activeProps={{ className: "bg-subtle" }}
              className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <UsersIcon size={16} />
              Spieler
            </Link>
          </div>
        </nav>
      </aside>
      <main className="flex-1 md:ml-52">
        <header className="border-layout fixed inset-x-0 top-0 grid h-14 grid-cols-3 items-center border-b px-4 md:left-52">
          <div className="flex items-center">
            {currentChampionship && (
              <ChampionshipSwitcher
                current={currentChampionship}
                championships={championships}
              />
            )}
          </div>
          <h1 className="text-center text-sm font-medium">{headerTitle}</h1>
          <div />
        </header>
        <div className="pt-14">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
