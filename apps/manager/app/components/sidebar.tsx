import {
  CalendarDays,
  Folders,
  ListChecks,
  LogOut,
  type LucideIcon,
  NotepadText,
  Pilcrow,
  Shield,
  Shirt,
  Star,
  Trophy,
  UserCog,
} from "lucide-react";
import { NavLink } from "react-router";

import { Logo } from "#/components/logo.tsx";

type NavItemProps = {
  to: string;
  end?: boolean;
  icon: LucideIcon;
  children: React.ReactNode;
};

function NavItem({ to, end, icon: Icon, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-sm px-2 py-1.5 text-sm transition-colors ${
          isActive ? "bg-nav-active text-accent" : "text-app hover:bg-nav-active"
        }`
      }
    >
      <Icon className="size-4 shrink-0" />
      {children}
    </NavLink>
  );
}

type SidebarProps = {
  slug: string | undefined;
  webAppUrl: string;
};

export function Sidebar({ slug, webAppUrl }: SidebarProps) {
  return (
    <aside className="border-subtle bg-surface-raised row-span-2 flex flex-col border-r">
      <a
        href={webAppUrl}
        className="border-subtle flex h-14 shrink-0 items-center gap-2.5 border-b px-4"
      >
        <div className="text-accent size-7">
          <Logo />
        </div>
        <span className="text-sm font-semibold">runde.tips</span>
      </a>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex flex-col gap-0.5 p-2">
          {slug && (
            <>
              <NavItem to={`/${slug}`} end icon={Trophy}>
                Turnier
              </NavItem>
              <NavItem to={`/${slug}/spiele`} icon={CalendarDays}>
                Spiele
              </NavItem>
              <NavItem to={`/${slug}/tipps`} icon={NotepadText}>
                Tipps
              </NavItem>
              <NavItem to={`/${slug}/ergebnisse`} icon={ListChecks}>
                Ergebnisse
              </NavItem>
              <NavItem to={`/${slug}/zusatzpunkte`} icon={Star}>
                Zusatzpunkte
              </NavItem>
            </>
          )}
        </nav>

        <div className="flex-1" />

        <div className="p-2">
          <p className="text-muted px-2 py-1 text-xs font-medium tracking-wider uppercase">
            Stammdaten
          </p>
          <nav className="mt-1 flex flex-col gap-0.5">
            <NavItem to="/turniere" icon={Folders}>
              Turniere
            </NavItem>
            <NavItem to="/spieler" icon={UserCog}>
              Spieler
            </NavItem>
            <NavItem to="/teams" icon={Shirt}>
              Teams
            </NavItem>
            <NavItem to="/ligen" icon={Shield}>
              Ligen
            </NavItem>
            <NavItem to="/regelwerke" icon={Pilcrow}>
              Regelwerke
            </NavItem>
          </nav>
        </div>

        <div className="border-subtle border-t p-2">
          <NavItem to="/logout" icon={LogOut}>
            Abmelden
          </NavItem>
        </div>
      </div>
    </aside>
  );
}
