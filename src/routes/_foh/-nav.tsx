import { DicesIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/nav-link";

export function FohNav() {
  return (
    <div className="px-2 grow flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <NavLink to="/">
          <TableIcon />
          <span>Tabelle</span>
        </NavLink>
        <NavLink to="/spieler">
          <UsersIcon />
          <span>Spieler</span>
        </NavLink>
        <NavLink to="/spiele">
          <DicesIcon />
          <span>Spiele</span>
        </NavLink>
      </div>
    </div>
  );
}
