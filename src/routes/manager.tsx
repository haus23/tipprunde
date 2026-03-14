import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { FoldersIcon, LayoutDashboardIcon, PilcrowIcon, TrophyIcon, UsersIcon } from "lucide-react";
import { Logo } from "@/components/logo.tsx";
import { requireManager } from "@/lib/auth/functions.ts";
import { fetchCurrentChampionship } from "@/lib/championships.ts";

export const Route = createFileRoute("/manager")({
  beforeLoad: async () => {
    const user = await requireManager();
    const currentChampionship = await fetchCurrentChampionship();
    return { user, currentChampionship };
  },
  component: ManagerLayout,
});
function ManagerLayout() {
  const { currentChampionship } = Route.useRouteContext();
  const matches = useMatches();

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
          <Link
            to="/manager"
            activeOptions={{ exact: true }}
            activeProps={{ className: "bg-subtle" }}
            className="hover:bg-subtle flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
          >
            <LayoutDashboardIcon size={16} />
            Dashboard
          </Link>

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
        <header className="border-layout fixed inset-x-0 top-0 flex h-14 items-center justify-center border-b md:left-52">
          <h1 className="text-sm font-medium">{headerTitle}</h1>
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
