import type { LinksFunction } from 'react-router';
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { UIProvider } from './components/ui/provider';

import stylesUrl from './styles/_index.css?url';
export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: stylesUrl },
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
