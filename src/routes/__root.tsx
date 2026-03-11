import type React from "react";

import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

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
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
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
