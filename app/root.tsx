import { Links, Outlet, Scripts, ScrollRestoration } from "react-router";
import { getUser, userContext } from "./utils/user.server";

import type { Route } from "./+types/root";

import stylesUrl from "./styles/base.css?url";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: stylesUrl,
    },
  ];
}

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context, request }, next) => {
    const { user, authCookieHeader } = await getUser(request);
    context.set(userContext, user);

    const response = await next();
    if (authCookieHeader) {
      response.headers.append("Set-Cookie", authCookieHeader);
    }

    return response;
  },
];

export function loader({ context }: Route.LoaderArgs) {
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
