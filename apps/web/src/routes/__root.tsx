import { Link, Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Logo } from "@tipprunde/ui";
import { I18nProvider } from "react-aria-components";

import { ColorSchemeMenu } from "#/components/color-scheme-menu.tsx";
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
          <div className="xs:px-4 mx-auto flex h-full max-w-5xl items-center px-2">
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
            <div className="ml-auto flex items-center gap-1">
              <ColorSchemeMenu colorScheme={colorScheme} />
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
