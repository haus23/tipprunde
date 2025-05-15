import type { Route } from './+types/root';

import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import { combineHeaders } from '~/utils/misc';
import { Toaster } from '~/utils/toast';
import { getToast } from '~/utils/toast.server';
import { getUser } from '~/utils/user.server';

import './root.css';

import { useAuthBroadcast } from '~/utils/user';

export async function loader({ request }: Route.LoaderArgs) {
  const { user, headers: authHeaders } = await getUser(request);
  const { toast, headers: toastHeaders } = await getToast(request);

  return data(
    { toast, user },
    { headers: combineHeaders(authHeaders, toastHeaders) },
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  useAuthBroadcast();

  return (
    <html lang="de" className='system' data-theme="mauvi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white text-app-12 dark:bg-black">
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}
