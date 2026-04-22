import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

import { ColorSchemeSwitch } from "#/components/color-scheme-switch.tsx";
import { Logo } from "#/components/logo.tsx";

export const Route = createFileRoute("/_front")({
  component: FrontLayout,
});

function FrontLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-input fixed inset-x-0 top-0 h-14 border-b px-4">
        <nav className="flex h-full items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-10">
              <Logo />
            </span>
            <span className="text-lg font-medium">runde.tips</span>
          </Link>
          <ColorSchemeSwitch />
        </nav>
      </header>
      <main className="flex flex-1 flex-col pt-14">
        <Outlet />
      </main>
    </div>
  );
}
