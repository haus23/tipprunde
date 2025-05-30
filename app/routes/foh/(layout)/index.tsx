import { Outlet } from 'react-router';

import { AppShell } from '~/components/shell/app-shell';
import { Nav } from '~/routes/foh/(layout)/-nav';

export default function Layout() {
  return (
    <AppShell nav={<Nav />}>
      <Outlet />
    </AppShell>
  );
}
