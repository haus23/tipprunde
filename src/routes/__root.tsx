import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import type React from "react";
import { I18nProvider } from "react-aria-components";

import { fetchUser } from "#/app/(auth)/session.ts";
import { queryClient } from "@/lib/query-client.ts";

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
    const user = await fetchUser();
    return { user };
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
  return (
    <html lang="de">
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
