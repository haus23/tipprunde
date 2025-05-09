import {
  CalendarIcon,
  DicesIcon,
  FoldersIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  PilcrowIcon,
  ScaleIcon,
  ShieldIcon,
  Table2Icon,
  TableIcon,
  TicketPlusIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react';
import { useMatch } from 'react-router';

import { Logo } from '~/components/shell/logo';
import { Link } from '~/components/ui/link';

function MainNav() {
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
        <Link to={'/hinterhof'} variant="sidebar">
          <LogInIcon className="size-5" />
          <span>Login</span>
        </Link>
      </div>
    </div>
  );
}

function AdminNav() {
  return (
    <div className="flex grow flex-col justify-between">
      <div className="flex flex-col gap-y-1.5 p-2">
        <Link to={'#'} variant="sidebar">
          <HomeIcon className="size-5" />
          <span>Dashboard</span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <TrophyIcon className="size-5" />
          <span>Turnier</span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <CalendarIcon className="size-5" />
          <span>Spiele</span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <DicesIcon className="size-5" />
          <span>Tipps</span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <ScaleIcon className="size-5" />
          <span>Ergebnisse</span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <TicketPlusIcon className="size-5" />
          <span>Zusatzpunkte</span>
        </Link>
      </div>
      <div>
        <div className="flex flex-col gap-y-1.5 p-2">
          <div className="px-1 text-app-11 text-xs">Stammdaten</div>
          <Link to={'/hinterhof'} variant="sidebar">
            <FoldersIcon className="size-5" />
            <span>Turniere</span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <UsersIcon className="size-5" />
            <span>Spieler</span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <ShieldIcon className="size-5" />
            <span>Teams</span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <Table2Icon className="size-5" />
            <span>Ligen</span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <PilcrowIcon className="size-5" />
            <span>Regelwerke</span>
          </Link>
        </div>
        <hr className="border-app-6" />
        <div className="flex flex-col gap-y-1.5 p-2">
          <Link to={'/'} variant="sidebar">
            <LogOutIcon className="size-5" />
            <span>Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
export function AppSidebar() {
  const isAdmin = useMatch('/hinterhof/*');

  return (
    <div className="fixed inset-y-0 left-0 flex w-[calc(var(--sidebar-width)-1px)] flex-col bg-app-1">
      <div className="p-2">
        <Link to={'/'} className="flex items-center gap-x-1">
          <Logo className="size-8" />
          <span className="text-lg">runde.tips</span>
        </Link>
      </div>
      <hr className="border-app-6" />
      {isAdmin ? <AdminNav /> : <MainNav />}
    </div>
  );
}
