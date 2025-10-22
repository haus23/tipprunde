import { HouseIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/nav-link";

export function HinterhofNav() {
  return (
    <div className="grow flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof">
          <HouseIcon size={18} />
          <span>Dashboard</span>
        </NavLink>
      </div>
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof/spieler">
          <UsersIcon size={18} />
          <span>Spieler</span>
        </NavLink>
      </div>
    </div>
  );
}
