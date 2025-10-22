import { HouseIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/nav-link";

export function HinterhofNav() {
  return (
    <div className="grow flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof">
          <HouseIcon className="size-5" />
          <span>Dashboard</span>
        </NavLink>
      </div>
      <div className="flex flex-col gap-2">
        <NavLink to="/hinterhof/spieler">
          <UsersIcon className="size-5" />
          <span>Spieler</span>
        </NavLink>
      </div>
    </div>
  );
}
