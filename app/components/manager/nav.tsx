import { CalendarIcon, FlagIcon, FoldersIcon, HomeIcon, ShieldIcon, TrophyIcon, UsersIcon } from "lucide-react";
import { NavLink } from "~/components/ui/link";
import { SidebarItem } from "../shell/sidebar-item";
import { UserView } from "../shell/user-view";
import { useChampionship } from "~/lib/manager/use-championship";

export function ManagerNav() {
  const championship = useChampionship();
  const championshipUrl = ["/hinterhof", championship?.id]
    .filter(Boolean)
    .join("/");

  return (
    <div className="grow flex flex-col justify-between">
      <div className="grow flex flex-col gap-2 px-2">
        <SidebarItem tooltip="Dashboard">
          <NavLink to={championshipUrl} end>
            <HomeIcon />
            <span>Dashboard</span>
          </NavLink>
        </SidebarItem>
        {championship && (
          <>
            <SidebarItem tooltip="Turnier">
              <NavLink to={`${championshipUrl}/turnier`}>
                <TrophyIcon />
                <span>Turnier</span>
              </NavLink>
            </SidebarItem>
            <SidebarItem tooltip="Spiele">
              <NavLink to={`${championshipUrl}/spiele`}>
                <CalendarIcon />
                <span>Spiele</span>
              </NavLink>
            </SidebarItem>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2 px-2">
          <span className="text-xs uppercase group-data-[sidebar-collapsed=true]/shell:hidden">
            Stammdaten
          </span>
          <SidebarItem tooltip="Tippturniere">
            <NavLink to="/hinterhof/stammdaten/turniere">
              <FoldersIcon />
              <span>Turniere</span>
            </NavLink>
          </SidebarItem>
          <SidebarItem tooltip="Spieler">
            <NavLink to="/hinterhof/stammdaten/spieler">
              <UsersIcon />
              <span>Spieler</span>
            </NavLink>
          </SidebarItem>
          <SidebarItem tooltip="Teams">
            <NavLink to="/hinterhof/stammdaten/teams">
              <ShieldIcon />
              <span>Teams</span>
            </NavLink>
          </SidebarItem>
          <SidebarItem tooltip="Ligen">
            <NavLink to="/hinterhof/stammdaten/ligen">
              <FlagIcon />
              <span>Ligen</span>
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
