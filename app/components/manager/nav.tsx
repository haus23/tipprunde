import { CalendarIcon, HomeIcon, TrophyIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/link";
import { SidebarItem } from "../shell/sidebar-item";
import { UserView } from "../shell/user-view";
import { useCurrentChampionship } from "~/lib/manager/use-current-championship";

export function ManagerNav() {
  const { currentChampionship } = useCurrentChampionship();
  const championshipId = currentChampionship?.id || "";

  return (
    <div className="grow flex flex-col justify-between">
      <div className="grow flex flex-col gap-2 px-2">
        <SidebarItem tooltip="Dashboard">
          <NavLink to="/hinterhof" end>
            <HomeIcon />
            <span>Dashboard</span>
          </NavLink>
        </SidebarItem>
        <SidebarItem tooltip="Turnier">
          <NavLink to={`/hinterhof/${championshipId}/turnier`}>
            <TrophyIcon />
            <span>Turnier</span>
          </NavLink>
        </SidebarItem>
        <SidebarItem tooltip="Spiele">
          <NavLink to={`/hinterhof/${championshipId}/spiele`}>
            <CalendarIcon />
            <span>Spiele</span>
          </NavLink>
        </SidebarItem>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 px-2">
          <span className="text-xs uppercase group-data-[sidebar-collapsed=true]/shell:hidden">
            Stammdaten
          </span>
          <SidebarItem tooltip="Tippturniere">
            <NavLink to="/hinterhof/turniere">
              <TrophyIcon />
              <span>Turniere</span>
            </NavLink>
          </SidebarItem>
          <SidebarItem tooltip="Spieler">
            <NavLink to="/hinterhof/spieler">
              <UsersIcon />
              <span>Spieler</span>
            </NavLink>
          </SidebarItem>
        </div>
        <hr className="mx-2 border-default" />
        <div className="px-2">
          <UserView />
        </div>
      </div>
    </div>
  );
}
