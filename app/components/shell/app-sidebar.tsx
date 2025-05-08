import { DicesIcon, TableIcon, UsersIcon } from 'lucide-react';
import { useMatch } from 'react-router';

import { Logo } from '~/components/shell/logo';
import { Link } from '~/components/ui/link';

function MainNav() {
  return (
    <div className="flex grow flex-col justify-between">
      <div className="flex flex-col gap-y-1.5 px-2">
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
      <div>
        <Link to={'/hinterhof'}>Hinterhof</Link>
      </div>
    </div>
  );
}

function AdminNav() {
  return (
    <div>
      <div>Hinterhof</div>
      <div>
        <Link to={'/'}>Startseite</Link>
      </div>
    </div>
  );
}
export function AppSidebar() {
  const isAdmin = useMatch('/hinterhof/*');

  return (
    <div className="fixed inset-y-0 left-0 flex w-[var(--sidebar-width)] flex-col bg-app-1">
      <div className="p-2">
        <Link to={'/'} className="flex items-center gap-x-1">
          <Logo className="size-8" />
          <span className="text-lg">runde.tips</span>
        </Link>
      </div>
      {isAdmin ? <AdminNav /> : <MainNav />}
    </div>
  );
}
