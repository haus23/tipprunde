import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { AppShell } from '~/components/shell/app-shell';

import './root.css';

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
        <AppShell>{children}</AppShell>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
