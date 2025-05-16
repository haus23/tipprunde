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
import { Form } from 'react-router';

import { Button } from '~/components/ui/button';
import { Link } from '~/components/ui/link';

export function Nav() {
  return (
    <div className="flex grow flex-col justify-between">
      <div className="flex flex-col gap-y-1.5 p-2 group-data-[sidebar-collapsed=true]:items-center group-data-[sidebar-collapsed=true]:px-0">
        <Link to={'#'} variant="sidebar">
          <HomeIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Dashboard
          </span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <TrophyIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Turnier
          </span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <CalendarIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Spiele
          </span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <DicesIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Tipps
          </span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <ScaleIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Ergebnisse
          </span>
        </Link>
        <Link to={'#'} variant="sidebar">
          <TicketPlusIcon className="size-5" />
          <span className="group-data-[sidebar-collapsed=true]:hidden">
            Zusatzpunkte
          </span>
        </Link>
      </div>
      <div>
        <div className="flex flex-col gap-y-1.5 p-2 group-data-[sidebar-collapsed=true]:items-center group-data-[sidebar-collapsed=true]:px-0">
          <div className="px-1 text-app-11 text-xs group-data-[sidebar-collapsed=true]:hidden">
            Stammdaten
          </div>
          <Link to={'/hinterhof'} variant="sidebar">
            <FoldersIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Turniere
            </span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <UsersIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Spieler
            </span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <ShieldIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Teams
            </span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <Table2Icon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Ligen
            </span>
          </Link>
          <Link to={'/hinterhof'} variant="sidebar">
            <PilcrowIcon className="size-5" />
            <span className="group-data-[sidebar-collapsed=true]:hidden">
              Regelwerke
            </span>
          </Link>
        </div>
        <hr className="border-app-6" />
        <div className="flex flex-col gap-y-1.5 p-2 group-data-[sidebar-collapsed=true]:items-center group-data-[sidebar-collapsed=true]:px-0">
          <Form action="/logout" method="post" className="flex">
            <Button type="submit" variant="sidebar">
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
