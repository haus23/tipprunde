import { Links, Meta, Outlet, Scripts, ScrollRestoration, redirect } from "react-router";

import type { Route } from "./+types/root";
import { getSessionUser } from "./lib/auth.server";
import { userContext } from "./lib/context";

import "./app.css";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ request, context }) => {
    const user = await getSessionUser(request);
    if (!user) throw redirect("/login");
    context.set(userContext, user);
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
