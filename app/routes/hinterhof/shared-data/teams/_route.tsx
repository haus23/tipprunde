import type { Route } from './+types/_route';

import { Button } from '~/components/ui/button';

export default function UsersRoute({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <div className="mx-2 flex items-center justify-between sm:mx-0">
        <h1 className="font-medium text-2xl">Teams</h1>
        <Button variant="default">Neues Team</Button>
      </div>
    </div>
  );
}
