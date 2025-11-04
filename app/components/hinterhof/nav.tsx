import { HomeIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/link";
import { SidebarItem } from "../shell/sidebar-item";

export function HinterhofNav() {
  return (
    <div className="px-2 grow flex flex-col justify-between">
      <div className="grow flex flex-col gap-2">
        <SidebarItem tooltip="Dashboard">
          <NavLink to="/hinterhof">
            <HomeIcon />
            <span>Dashboard</span>
          </NavLink>
        </SidebarItem>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase group-data-[sidebar-collapsed=true]:hidden">
            Stammdaten
          </span>
          <SidebarItem tooltip="Spieler">
            <NavLink to="/hinterhof/spieler">
              <UsersIcon />
              <span>Spieler</span>
            </NavLink>
          </SidebarItem>
        </div>
      </div>
    </div>
  );
}
