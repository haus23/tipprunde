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

import { ShellProvider } from '~/components/shell/shell-provider';
import { useTheme } from '~/utils/prefs';
import { getSettings, getTheme } from '~/utils/prefs.server';
import { useAuthBroadcast } from '~/utils/user';

export async function loader({ request }: Route.LoaderArgs) {
  const { user, headers: authHeaders } = await getUser(request);
  const { toast, headers: toastHeaders } = await getToast(request);
  const theme = await getTheme(request);
  const settings = await getSettings(request);

  return data(
    { settings, theme, toast, user },
    { headers: combineHeaders(authHeaders, toastHeaders) },
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  useAuthBroadcast();

  return (
    <html lang="de" className={theme.colorScheme} data-theme={theme.themeColor}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <ShellProvider>
      <Outlet />
    </ShellProvider>
  );
}
