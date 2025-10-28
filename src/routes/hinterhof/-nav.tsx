import { HouseIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/nav-link";

export function HinterhofNav() {
  return (
    <div className="grow flex flex-col justify-between gap-2">
      <div className="px-2 flex flex-col gap-2">
        <NavLink to="/hinterhof">
          <HouseIcon />
          <span>Dashboard</span>
        </NavLink>
      </div>
      <div className="flex flex-col gap-2">
        <div className="px-2 flex flex-col gap-2">
          <span className="text-xs uppercase group-data-[sidebar-collapsed=true]:hidden">
            Stammdaten
          </span>
          <div className="flex flex-col gap-2">
            <NavLink to="/hinterhof/spieler">
              <UsersIcon />
              <span>Spieler</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
