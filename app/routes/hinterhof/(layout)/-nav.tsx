import {
  CalendarIcon,
  DicesIcon,
  FoldersIcon,
  HomeIcon,
  LogOutIcon,
  PilcrowIcon,
  ScaleIcon,
  ShieldIcon,
  Table2Icon,
  TicketPlusIcon,
  TrophyIcon,
  UsersIcon,
} from 'lucide-react';

import { Link } from '~/components/ui/link';

export function Nav() {
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
