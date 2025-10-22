import { DicesIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/nav-link";

export function FohNav() {
  return (
    <div className="grow flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <NavLink to="/">
          <TableIcon size={18} />
          <span>Tabelle</span>
        </NavLink>
        <NavLink to="/spieler">
          <UsersIcon size={18} />
          <span>Spieler</span>
        </NavLink>
        <NavLink to="/spiele">
          <DicesIcon size={18} />
          <span>Spiele</span>
        </NavLink>
      </div>
    </div>
  );
}
