import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { Button, Logo } from "@tipprunde/ui";
import { ChevronDownIcon, LogInIcon, LogOutIcon } from "lucide-react";
import { Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
import { I18nProvider } from "react-aria-components";

const navItems = [
  { to: "/tabelle", label: "Tabelle" },
  { to: "/spieler", label: "Spieler" },
  { to: "/spiele", label: "Spiele" },
] as const;

import { ColorSchemeMenu } from "#/components/color-scheme-menu.tsx";
import { logout } from "#/lib/auth.ts";
import type { ColorScheme } from "#/lib/session.ts";
import { getSessionData } from "#/lib/session.ts";

import appCss from "../styles/app.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async () => await getSessionData(),
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
  const { colorScheme } = Route.useRouteContext();
  return (
    <RootDocument colorScheme={colorScheme}>
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
              <UserArea />
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

function UserArea() {
  const { user, managerUrl } = Route.useRouteContext();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    await router.invalidate();
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="text-muted hover:bg-nav-active hover:text-app focus-visible:ring-accent flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm transition ease-out outline-none focus-visible:ring-2 max-sm:px-1.5"
      >
        <span className="max-sm:sr-only">Anmelden</span>
        <LogInIcon className="size-4" />
      </Link>
    );
  }

  if (user.role === "user") {
    return (
      <Button intent="ghost" size="sm" className="max-sm:px-1.5" onPress={handleLogout}>
        <span className="max-sm:sr-only">Abmelden</span>
        <LogOutIcon className="size-4" />
      </Button>
    );
  }

  return (
    <MenuTrigger>
      <Button intent="ghost" size="sm" className="max-sm:px-1.5">
        <span className="max-sm:sr-only">{user.name}</span>
        <ChevronDownIcon className="size-4" />
      </Button>
      <Popover
        placement="bottom end"
        offset={4}
        className="border-subtle bg-surface-raised shadow-popover w-44 origin-top-right rounded-md border p-1 transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Menu className="outline-none">
          <MenuItem
            href={managerUrl}
            className="text-app data-focused:bg-nav-active flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
          >
            Manager
          </MenuItem>
          <MenuItem
            onAction={handleLogout}
            className="text-app data-focused:bg-nav-active flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none"
          >
            Abmelden
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <div className="has-aria-[current=page]:border-accent flex h-full items-center border-b-2 border-transparent">
      <Link
        to={to}
        activeProps={{ "aria-current": "page", className: "text-app" }}
        inactiveProps={{ className: "text-muted" }}
        className="focus-visible:ring-accent hover:bg-nav-active hover:text-app rounded-sm px-3 py-1.5 text-sm font-medium transition ease-out outline-none focus-visible:ring-2"
      >
        {children}
      </Link>
    </div>
  );
}

function RootDocument({
  children,
  colorScheme,
}: Readonly<{ children: React.ReactNode; colorScheme: ColorScheme }>) {
  return (
    <html lang="de" data-color-scheme={colorScheme}>
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nProvider locale="de-DE">{children}</I18nProvider>
        <Scripts />
      </body>
    </html>
  );
}
