import { DicesIcon, SettingsIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/link";
import { SidebarItem } from "../shell/sidebar-item";
import { UserView } from "../shell/user-view";
import { useUser } from "~/lib/auth/user";
import { isAuthenticated } from "~/lib/auth/permissions";

export function FohNav() {
  const user = useUser();

  return (
    <div className="grow flex flex-col justify-between">
      <div className="flex flex-col gap-2 px-2">
        <SidebarItem tooltip="Tabelle">
          <NavLink to="/">
            <TableIcon />
            <span>Tabelle</span>
          </NavLink>
        </SidebarItem>
        <SidebarItem tooltip="Spieler">
          <NavLink to="/spieler">
            <UsersIcon />
            <span>Spieler</span>
          </NavLink>
        </SidebarItem>
        <SidebarItem tooltip="Spiele">
          <NavLink to="/spiele">
            <DicesIcon />
            <span>Spiele</span>
          </NavLink>
        </SidebarItem>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 px-2">
          <span className="text-xs uppercase group-data-[sidebar-collapsed=true]:hidden">
            Verwaltung
          </span>
          <SidebarItem tooltip="Verwaltung">
            <NavLink to="/hinterhof">
              <SettingsIcon />
              <span>Dashboard</span>
            </NavLink>
          </SidebarItem>
        </div>
        {isAuthenticated(user) && (
          <>
            <hr className="mx-2" />
            <div className="px-2">
              <UserView />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
