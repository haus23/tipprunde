import { DicesIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/nav-link";

export function FohNav() {
  return (
    <div className="grow flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <NavLink to="/">
          <TableIcon className="size-5" />
          <span>Tabelle</span>
        </NavLink>
        <NavLink to="/spieler">
          <UsersIcon className="size-5" />
          <span>Spieler</span>
        </NavLink>
        <NavLink to="/spiele">
          <DicesIcon className="size-5" />
          <span>Spiele</span>
        </NavLink>
      </div>
    </div>
  );
}
