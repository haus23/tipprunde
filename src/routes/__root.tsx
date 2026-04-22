import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type React from "react";
import { I18nProvider } from "react-aria-components";

import { fetchUser } from "#/app/(auth)/session.ts";
import { getUISettingsFn } from "#/app/settings/ui.ts";
import { queryClient } from "#/utils/query-client.ts";

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
    <I18nProvider locale="de-DE">
      <QueryClientProvider client={queryClient}>
        <RootDocument>
          <Outlet />
        </RootDocument>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </I18nProvider>
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
