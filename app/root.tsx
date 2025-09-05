import { Links, Meta, Outlet, Scripts, ScrollRestoration, type LoaderFunctionArgs } from "react-router";
import "./root.css";
import { AppShell } from "./components/shell/app-shell";
import { getUserPreferences } from "./utils/user-prefs.server";
import { useTheme } from "./utils/user-prefs";

export async function loader({ request }: LoaderFunctionArgs) {
  const userPrefs = await getUserPreferences(request);
  return { userPrefs };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { colorScheme } = useTheme();
  
  // Apply color scheme class: 'dark', 'light', or 'system' for system preference
  const colorSchemeClass = colorScheme;
  
  return (
    <html lang="de" className={colorSchemeClass}>
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
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
