import { Outlet } from "react-router";
import { ScrollRestoration } from "react-router";
import { Links } from "react-router";

import stylesUrl from "./styles/base.css?url";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
      </body>
    </html>
  );
}

export function ServerComponent() {
  return <Outlet />;
}
