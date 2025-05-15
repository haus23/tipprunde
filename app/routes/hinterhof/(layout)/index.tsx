import type { Route } from './+types/index';

import { Outlet } from 'react-router';

import { AppShell } from '~/components/shell/app-shell';
import { Nav } from '~/routes/hinterhof/(layout)/-nav';
import { requireAdmin } from '~/utils/user.server';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
}

export default function Layout() {
  return (
    <AppShell nav={<Nav />}>
      <Outlet />
    </AppShell>
  );
}
