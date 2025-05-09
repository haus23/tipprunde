import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';

import './root.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" data-theme="mauvi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white text-app-12 dark:bg-black">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
