import type { Route } from './+types/_route';

import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { getTeams } from '~/utils/db/team';
import { requireAdmin } from '~/utils/user.server';

import { columns } from './column-defs';

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);

  const teams = await getTeams();
  return { teams };
}

export default function UsersRoute({ loaderData }: Route.ComponentProps) {
  console.log(loaderData);
  return (
    <div>
      <div className="mx-2 flex items-center justify-between sm:mx-0">
        <h1 className="font-medium text-2xl">Teams</h1>
        <Button variant="default">Neues Team</Button>
      </div>
      <div className="mt-4 overflow-clip sm:rounded-xl sm:border">
        <DataTable
          columns={columns}
          data={loaderData.teams}
          withFilter
          withPagination
        />
      </div>
    </div>
  );
}
