import type { Route } from './+types/root';

import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import { getToast } from '~/utils/toast.server';

import './root.css';

import { combineHeaders } from '~/utils/misc';

export async function loader({ request }: Route.LoaderArgs) {
  const { toast, headers: toastHeaders } = await getToast(request);

  if (toast) {
    console.log(toast);
  } else {
    console.log('No toast');
  }

  return data(null, { headers: combineHeaders(toastHeaders) });
}

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
