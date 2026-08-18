import { Logo } from "@tipprunde/ui";
import {
  Link,
  Outlet,
  isRouteErrorResponse,
  useLocation,
  useRouteError,
  useRouteLoaderData,
} from "react-router";

import { championshipBasePath } from "#/components/championship-scope.tsx";
import { ColorSchemeToggle } from "#/components/color-scheme-toggle.tsx";
import type { User } from "#/lib/context.ts";
import { userContext } from "#/lib/context.ts";
import type { loader as rootLoader } from "#/root.tsx";

import type { Route } from "./+types/_layout";
import { PublicNavLink } from "./_nav-link.tsx";
import { NavigationProgress } from "./_navigation-progress.tsx";
import { UserArea } from "./_user-area.tsx";

const navItems = [
  { to: "/tabelle", label: "Tabelle" },
  { to: "/tipps", label: "Spieler" },
  { to: "/spiele", label: "Spiele" },
] as const;

export function loader({ context }: Route.LoaderArgs) {
  return { user: context.get(userContext) };
}

export default function PublicLayout({ loaderData }: Route.ComponentProps) {
  return (
    <PublicShell user={loaderData.user}>
      <Outlet />
    </PublicShell>
  );
}

/**
 * Errors below this layout keep the shell — a 404 should still look like the
 * site, the way the old web app's notFoundComponent did.
 */
export function ErrorBoundary() {
  const error = useRouteError();
  const root = useRouteLoaderData<typeof rootLoader>("root");
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <PublicShell user={root?.user ?? null}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <title>{isNotFound ? "Seite nicht gefunden · runde.tips" : "Fehler · runde.tips"}</title>
        <h1 className="text-xl font-semibold">
          {isNotFound ? "Seite nicht gefunden" : "Etwas ist schiefgelaufen"}
        </h1>
        <p className="text-subtle text-sm">
          {isNotFound && typeof error.data === "string" && error.data
            ? error.data
            : isNotFound
              ? "Diese Seite existiert nicht."
              : "Bitte versuche es später noch einmal."}
        </p>
        {/* Never leak internals to visitors — details are a dev affordance. */}
        {import.meta.env.DEV && !isNotFound && (
          <pre className="bg-surface-raised text-subtle max-w-xl overflow-auto rounded-md p-4 text-left text-xs">
            {error instanceof Error ? (error.stack ?? error.message) : String(error)}
          </pre>
        )}
        <Link to="/" className="text-accent text-sm transition-colors hover:underline">
          Zur Startseite
        </Link>
      </div>
    </PublicShell>
  );
}

function PublicShell({ user, children }: { user: User | null; children: React.ReactNode }) {
  // The nav follows whichever championship is in scope, so browsing an archived
  // season stays in that season — the same way the manager sidebar keeps to
  // /manager/:slug. Empty prefix outside any season (/archiv, /login, 404).
  const basePath = championshipBasePath(useLocation().pathname);

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
                prefetch="intent"
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
                <PublicNavLink key={item.to} to={`${basePath}${item.to}`}>
                  {item.label}
                </PublicNavLink>
              ))}
            </nav>
            {/* Right: scheme + user */}
            <div className="col-start-3 flex items-center justify-end gap-1">
              <ColorSchemeToggle />
              <UserArea user={user} />
            </div>
          </div>
        </header>
        <main className="xs:px-4">{children}</main>
      </div>
    </>
  );
}
