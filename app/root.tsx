import type { LinksFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { UIProvider } from './components/ui/provider';
import { getPrefsSession } from './utils/.server/sessions';
import { useTheme } from './utils/theme';

import stylesUrl from './styles/_index.css?url';
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
];

import type { Route } from './+types/root';

export async function loader({ request }: Route.LoaderArgs) {
  const prefs = await getPrefsSession(request);

  return {
    requestInfo: {
      theme: prefs.get('theme'),
    },
  };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <html
      lang="de"
      {...{ className: theme.colorScheme === 'dark' ? 'dark' : undefined }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UIProvider>{children}</UIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
