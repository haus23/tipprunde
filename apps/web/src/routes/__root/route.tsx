import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Logo } from "@tipprunde/ui";

const navItems = [
  { to: "/tabelle", label: "Tabelle" },
  { to: "/tipps", label: "Spieler" },
  { to: "/spiele", label: "Spiele" },
] as const;

import { getSessionData } from "#/lib/session.ts";

import { ColorSchemeMenu } from "./-color-scheme-menu.tsx";
import { NavLink } from "./-nav-link.tsx";
import { NavigationProgress } from "./-navigation-progress.tsx";
import { RootDocument } from "./-root-document.tsx";
import { RootErrorBoundary } from "./-root-error-boundary.tsx";
import { RootNotFound } from "./-root-not-found.tsx";
import { UserArea } from "./-user-area.tsx";

import appCss from "../../styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async () => await getSessionData(),
  errorComponent: RootErrorBoundary,
  notFoundComponent: RootNotFound,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "runde.tips",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  const { colorScheme, user, managerUrl } = Route.useRouteContext();
  return (
    <RootDocument colorScheme={colorScheme}>
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
                <NavLink key={item.to} to={item.to}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            {/* Right: scheme + user */}
            <div className="col-start-3 flex items-center justify-end gap-1">
              <ColorSchemeMenu colorScheme={colorScheme} />
              <UserArea user={user} managerUrl={managerUrl} />
            </div>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {import.meta.env.DEV && <ReactQueryDevtools />}
    </RootDocument>
  );
}
