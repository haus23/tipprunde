import type { Route } from './+types/_index';

import { requireManager } from '~/utils/user.server';

export function meta() {
  return [{ title: 'Hinterhof - runde.tips' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireManager(request);
  return null;
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="font-medium text-2xl">Dashboard</h1>
    </div>
  );
}
