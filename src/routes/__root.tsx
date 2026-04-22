import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type React from "react";

import { fetchUser } from "#/app/(auth)/session.ts";
import { getUISettingsFn } from "#/app/settings/ui.ts";
import { Providers } from "#/components/providers.tsx";

import rootCss from "../styles/root.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
    ],
    links: [{ rel: "stylesheet", href: rootCss }],
  }),
  beforeLoad: async () => {
    const [user, uiSettings] = await Promise.all([fetchUser(), getUISettingsFn()]);
    return { user, uiSettings };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <Providers>
      <RootDocument>
        <Outlet />
      </RootDocument>
    </Providers>
  );
}

function RootDocument({ children }: Readonly<{ children: React.ReactNode }>) {
  const { uiSettings } = Route.useRouteContext();
  return (
    <html lang="de" data-color-scheme={uiSettings.colorScheme}>
      <head>
        <HeadContent />
      </head>
      <body className="bg-base relative isolate w-full text-base">
        {children}
        <Scripts />
      </body>
    </html>
  );
}
