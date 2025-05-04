import { Outlet } from 'react-router';

import { AdminSidebar } from '~/components/shell/admin-sidebar';
import { AppShell } from '~/components/shell/app-shell';

export default function Layout() {
  return (
    <AppShell sidebar={AdminSidebar}>
      <Outlet />
    </AppShell>
  );
}
