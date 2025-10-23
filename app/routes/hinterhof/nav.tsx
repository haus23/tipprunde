import { HouseIcon, UsersIcon } from "lucide-react";
import { UserView } from "~/components/shell/user-view";
import { NavLink } from "~/components/ui/nav-link";

export function HinterhofNav() {
  return (
    <div className="grow flex flex-col justify-between gap-2">
      <div className="px-2 flex flex-col gap-2">
        <NavLink to="/hinterhof">
          <HouseIcon size={18} />
          <span>Dashboard</span>
        </NavLink>
      </div>
      <div className="flex flex-col gap-2">
        <div className="px-2 flex flex-col gap-2">
          <span className="text-xs uppercase">Stammdaten</span>
          <div className="flex flex-col gap-2">
            <NavLink to="/hinterhof/spieler">
              <UsersIcon size={18} />
              <span>Spieler</span>
            </NavLink>
          </div>
        </div>
        <hr />
        <div className="px-2 flex flex-col gap-2">
          <UserView />
        </div>
      </div>
    </div>
  );
}
