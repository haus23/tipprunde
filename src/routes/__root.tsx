import type React from "react";

import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { fetchSession } from "@/lib/auth/functions.ts";
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
    const session = await fetchSession();
    return { session };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootDocument>
        <Outlet />
      </RootDocument>
      <ReactQueryDevtools />
    </QueryClientProvider>
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
