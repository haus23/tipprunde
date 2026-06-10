import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import { ColorScheme, getSessionData } from "#/lib/session.ts";

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
      <Outlet />
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
        {children}
        <Scripts />
      </body>
    </html>
  );
}
