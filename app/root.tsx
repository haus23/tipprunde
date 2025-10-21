import { Links, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { Route } from "./+types/root";

import stylesUrl from "./styles/base.css?url";
import { userContext } from "./utils/user.context";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context }) => {
    console.log("Root auth middleware");

    context.set(userContext, null);
  },
];

export function loader({ context }: Route.LoaderArgs) {
  console.log("Root loader");

  const user = context.get(userContext);
  return { user };
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
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
