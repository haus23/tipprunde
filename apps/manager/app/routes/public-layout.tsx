import { Logo } from "@tipprunde/ui";
import { Link, Outlet, useRouteLoaderData } from "react-router";

import { ColorSchemeMenu } from "#/components/color-scheme-menu.tsx";
import { NavigationProgress } from "#/components/navigation-progress.tsx";
import { PublicNavLink } from "#/components/public-nav-link.tsx";
import { UserArea } from "#/components/user-area.tsx";
import { userContext } from "#/lib/context.ts";

import type { loader as rootLoader } from "../root";
import type { Route } from "./+types/public-layout";

const navItems = [
  { to: "/tabelle", label: "Tabelle" },
  { to: "/tipps", label: "Spieler" },
  { to: "/spiele", label: "Spiele" },
] as const;

export function loader({ context }: Route.LoaderArgs) {
  return { user: context.get(userContext) };
}

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
  const colorScheme = useRouteLoaderData<typeof rootLoader>("root")?.colorScheme ?? "system";

  return (
    <>
      <NavigationProgress />
      <div className="flex min-h-svh flex-col">
        <header className="border-subtle bg-surface sticky top-0 z-10 h-14 border-b">
          <div className="xs:px-4 mx-auto grid h-full max-w-4xl grid-cols-[1fr_auto_1fr] items-center px-2">
            {/* Left: home link */}
            <div className="col-start-1 flex items-center">
              <Link
                to="/"
                className="focus-visible:ring-accent flex items-center gap-2 rounded px-1 pb-0.5 outline-none focus-visible:ring-2"
              >
                <span className="text-accent size-8">
                  <Logo />
                </span>
                <span className="hidden pr-2 text-sm font-semibold tracking-tight sm:block">
                  runde.tips
                </span>
              </Link>
            </div>
            {/* Center: nav — always visible */}
            <nav className="col-start-2 flex h-full items-center justify-center gap-1">
              {navItems.map((item) => (
                <PublicNavLink key={item.to} to={item.to}>
                  {item.label}
                </PublicNavLink>
              ))}
            </nav>
            {/* Right: scheme + user */}
            <div className="col-start-3 flex items-center justify-end gap-1">
              <ColorSchemeMenu colorScheme={colorScheme} />
              <UserArea user={loaderData.user} />
            </div>
          </div>
        </header>
        <main className="xs:px-4">
          <Outlet />
        </main>
      </div>
    </>
  );
}
