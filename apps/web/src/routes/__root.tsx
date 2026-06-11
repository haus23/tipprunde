import {
  Link,
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { Button, Logo } from "@tipprunde/ui";
import { ChevronDownIcon, LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { useContext } from "react";
import {
  Dialog,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuTrigger,
  OverlayTriggerStateContext,
  Popover,
} from "react-aria-components";
import { I18nProvider } from "react-aria-components";

const navItems = [
  { to: "/tabelle", label: "Tabelle" },
  { to: "/spieler", label: "Spieler" },
  { to: "/spiele", label: "Spiele" },
  { to: "/archiv", label: "Archiv" },
] as const;

import { ColorSchemeMenu } from "#/components/color-scheme-menu.tsx";
import { logout } from "#/lib/auth.ts";
import type { ColorScheme } from "#/lib/session.ts";
import { getSessionData } from "#/lib/session.ts";

import appCss from "../styles/app.css?url";

export const Route = createRootRoute({
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
          <div className="xs:px-4 xs:grid-cols-[1fr_auto_1fr] mx-auto grid h-full max-w-5xl grid-cols-[auto_1fr_auto] items-center px-2">
            {/* Left: nav menu (below xs, GitHub-style) + home link */}
            <div className="col-start-1 flex items-center">
              <div className="xs:hidden pr-1">
                <DialogTrigger>
                  <Button intent="ghost" size="icon" aria-label="Navigation">
                    <MenuIcon className="size-4" />
                  </Button>
                  <Popover
                    placement="bottom start"
                    offset={4}
                    className="border-subtle bg-surface-raised shadow-popover w-44 origin-top-left rounded-md border py-1.5 transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
                  >
                    <Dialog aria-label="Navigation" className="outline-none">
                      <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                          <NavLink key={item.to} to={item.to} orientation="vertical">
                            {item.label}
                          </NavLink>
                        ))}
                      </nav>
                    </Dialog>
                  </Popover>
                </DialogTrigger>
              </div>
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
            {/* Center: nav — xs and up */}
            <nav className="xs:flex col-start-2 hidden h-full items-center justify-center gap-1">
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

function NavLink({
  to,
  children,
  orientation = "horizontal",
}: {
  to: string;
  children: React.ReactNode;
  orientation?: "horizontal" | "vertical";
}) {
  const dialog = useContext(OverlayTriggerStateContext);
  const linkClasses =
    "px-3 py-1.5 text-sm font-medium outline-none transition ease-out hover:bg-nav-active hover:text-app focus-visible:ring-2 focus-visible:ring-accent";

  // Vertical: wrapper carries the leading accent bar; link carries the colors + hover bg.
  if (orientation === "vertical") {
    return (
      <div className="has-aria-[current=page]:border-l-accent border-x-2 border-transparent px-1.5">
        <Link
          to={to}
          onClick={() => dialog?.close()}
          activeProps={{ "aria-current": "page", className: "text-app" }}
          inactiveProps={{ className: "text-muted" }}
          className={`${linkClasses} block rounded-sm`}
        >
          {children}
        </Link>
      </div>
    );
  }

  // Horizontal: full-height wrapper carries the underline at the header's bottom edge.
  return (
    <div className="has-aria-[current=page]:border-accent flex h-full items-center border-b-2 border-transparent">
      <Link
        to={to}
        activeProps={{ "aria-current": "page", className: "text-app" }}
        inactiveProps={{ className: "text-muted" }}
        className={`${linkClasses} rounded-sm`}
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
