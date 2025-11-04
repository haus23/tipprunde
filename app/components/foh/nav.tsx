import { DicesIcon, SettingsIcon, TableIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/link";
import { SidebarItem } from "../shell/sidebar-item";

export function FohNav() {
  return (
    <div className="px-2 grow flex flex-col justify-between">
      <div className="flex flex-col gap-2">
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
        <div className="flex flex-col gap-2">
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
      </div>
    </div>
  );
}
