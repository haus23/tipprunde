import {
  DicesIcon,
  LogInIcon,
  LogOutIcon,
  SettingsIcon,
  TableIcon,
  UsersIcon,
} from 'lucide-react';
import { Form } from 'react-router';

import { Button } from '~/components/ui/button';
import { Link } from '~/components/ui/link';
import { useUser } from '~/utils/user';

export function Nav() {
  const user = useUser();

  return (
    <div className="flex grow flex-col justify-between">
      <div className="flex flex-col gap-y-1.5 p-2">
        <Link to={'#'} variant="sidebar">
          <TableIcon className="size-5" />
          <span>Tabelle</span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <UsersIcon className="size-5" />
          <span>Spieler</span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <DicesIcon className="size-5" />
          <span>Spiele</span>
        </Link>
      </div>
      <div className="flex flex-col gap-y-1.5 p-2">
        {user.isAdmin && (
          <Link to={'/hinterhof'} variant="sidebar">
            <SettingsIcon className="size-5" />
            <span>Manager</span>
          </Link>
        )}
        {user.isAuthenticated ? (
          <Form action="/logout" method="post" className="flex">
            <Button type="submit" variant="sidebar">
              <LogOutIcon className="size-5" />
              <span>Logout</span>
            </Button>
          </Form>
        ) : (
          <Link to={'/login'} variant="sidebar">
            <LogInIcon className="size-5" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
