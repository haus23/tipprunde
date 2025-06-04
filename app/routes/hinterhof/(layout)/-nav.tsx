import {
  CalendarIcon,
  ConstructionIcon,
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
import { Form } from 'react-router';

import { Button } from '~/components/ui/button';
import { Link } from '~/components/ui/link';

export function Nav() {
  return (
    <div className="flex grow flex-col justify-between">
      <div className="flex flex-col gap-y-1.5 p-2 group-data-[sidebar-collapsed=true]:items-center group-data-[sidebar-collapsed=true]:px-0">
        <Link to={'/hinterhof'} variant="sidebar" tooltip="Dashboard">
          <HomeIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Dashboard
          </span>
        </Link>
        <Link to={'#'} variant="sidebar" tooltip="Turnier">
          <TrophyIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Turnier
          </span>
        </Link>
        <Link to={'#'} variant="sidebar" tooltip="Spiele">
          <CalendarIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Spiele
          </span>
        </Link>
        <Link to={'#'} variant="sidebar" tooltip="Tipps">
          <DicesIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Tipps
          </span>
        </Link>
        <Link to={'#'} variant="sidebar" tooltip="Ergebnisse">
          <ScaleIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Ergebnisse
          </span>
        </Link>
        <Link to={'#'} variant="sidebar" tooltip="Zusatzpunkte">
          <TicketPlusIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Zusatzpunkte
          </span>
        </Link>
        <Link to={'/hinterhof/wartung'} variant="sidebar" tooltip="Wartung">
          <ConstructionIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Wartung
          </span>
        </Link>
      </div>
      <div>
        <div className="flex flex-col gap-y-1.5 p-2 group-data-[sidebar-collapsed=true]:items-center group-data-[sidebar-collapsed=true]:px-0">
          <div className="px-1 text-app-11 text-xs group-data-[sidebar-collapsed=true]:hidden">
            Stammdaten
          </div>
          <Link to={'/hinterhof'} variant="sidebar" tooltip="Turniere">
            <FoldersIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Turniere
            </span>
          </Link>
          <Link to={'/hinterhof/spieler'} variant="sidebar" tooltip="Spieler">
            <UsersIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Spieler
            </span>
          </Link>
          <Link to={'/hinterhof/teams'} variant="sidebar" tooltip="Teams">
            <ShieldIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Teams
            </span>
          </Link>
          <Link to={'/hinterhof/ligen'} variant="sidebar" tooltip="Ligen">
            <Table2Icon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Ligen
            </span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar" tooltip="Regelwerke">
            <PilcrowIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Regelwerke
            </span>
          </Link>
        </div>
        <hr />
        <div className="flex flex-col gap-y-1.5 p-2 group-data-[sidebar-collapsed=true]:items-center group-data-[sidebar-collapsed=true]:px-0">
          <Form action="/logout" method="post" className="flex">
            <Button type="submit" variant="sidebar" tooltip="Logout">
              <LogOutIcon className="size-5" />
              <span className="group-data-[sidebar-collapsed=true]:hidden">
                Logout
              </span>
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
