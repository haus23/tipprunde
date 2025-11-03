import { data, Links, Outlet, Scripts, ScrollRestoration } from "react-router";

import { AppShell } from "./components/shell/app-shell";
import { ShellProvider } from "./components/shell/provider";
import { getPrefsSession } from "./lib/prefs/session";

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

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getPrefsSession(request);
  const settings = session.get("settings");

  return data({ settings });
}

export default function App() {
  return (
    <ShellProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </ShellProvider>
  );
}
