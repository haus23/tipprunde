import type { Route } from './+types/_route';

import { DataTable } from '~/components/ui/data-table';
import { columns } from '~/routes/hinterhof/shared-data/users/column-defs';
import { db } from '~/utils/db.server';
import { requireAdmin } from '~/utils/user.server';

export function meta() {
  return [{ title: 'Hinterhof - runde.tips' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);

  const users = await db.instance.query.users.findMany();
  return { users };
}

export default function UsersRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="font-medium text-2xl">Spieler</h1>
      <div className="mt-4 overflow-clip rounded-xl border">
        <DataTable columns={columns} data={loaderData.users} />
      </div>
    </div>
  );
}
