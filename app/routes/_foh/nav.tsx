import { DicesIcon, SettingsIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/nav-link";
import { useUser } from "~/utils/user";

export function FohNav() {
  const user = useUser();

  return (
    <div className="px-2 grow flex flex-col justify-between">
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
      {user?.isManager && (
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase">Hinterhof</span>
          <div className="flex flex-col gap-2">
            <NavLink to="/hinterhof">
              <SettingsIcon size={18} />
              <span>Dashboard</span>
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
}
