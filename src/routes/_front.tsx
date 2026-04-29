import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { ColorSchemeSwitch } from "#/components/color-scheme-switch.tsx";
import { Logo } from "#/components/logo.tsx";

export const Route = createFileRoute("/_front")({
  component: FrontLayout,
});

const navLinkClass =
  "rounded-md px-3 py-1.5 text-sm font-medium text-subtle outline-none transition-colors hover:bg-subtle hover:text-base focus-visible:ring-2 focus-visible:ring-focus";

function FrontLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-layout bg-base sticky top-0 z-10 h-14 border-b">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
          <Link
            to="/"
            className="focus-visible:ring-focus flex items-center gap-2 rounded-md pr-3 pl-1 outline-none focus-visible:ring-2"
          >
            <span className="text-accent size-8">
              <Logo />
            </span>
            <span className="hidden text-sm font-semibold tracking-tight sm:block">runde.tips</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/tabelle" className={navLinkClass}>
              Tabelle
            </Link>
            <a href="/spieler" className={navLinkClass}>
              Spieler
            </a>
            <a href="/spiele" className={navLinkClass}>
              Spiele
            </a>
          </nav>
          <ColorSchemeSwitch />
        </div>
      </header>
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}
