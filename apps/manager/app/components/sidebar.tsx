import {
  CalendarIcon,
  DicesIcon,
  FoldersIcon,
  ListChecksIcon,
  LogOutIcon,
  type LucideIcon,
  PilcrowIcon,
  ShieldIcon,
  ShirtIcon,
  RocketIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { Form, NavLink } from "react-router";

import { Logo } from "#/components/logo.tsx";
import { cn } from "#/lib/utils.ts";

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
      className={cn(
        "group flex items-center gap-2.5 rounded-sm px-2 py-2 text-sm transition-colors",
        "text-app hover:bg-nav-active",
        "aria-[current=page]:bg-nav-active",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      )}
    >
      <Icon className="group-aria-[current=page]:text-accent size-4 shrink-0" />
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
      <div className="border-subtle flex h-14 shrink-0 items-center border-b px-2">
        <a
          href={webAppUrl}
          className="hover:bg-nav-active focus-visible:ring-accent flex h-9 w-full items-center gap-2.5 rounded-sm px-2 focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="text-accent size-7">
            <Logo />
          </div>
          <span className="text-sm font-semibold">runde.tips</span>
        </a>
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex flex-col gap-1 p-2">
          {slug ? (
            <>
              <NavItem to={`/${slug}`} end icon={TrophyIcon}>
                Turnier
              </NavItem>
              <NavItem to={`/${slug}/spiele`} icon={CalendarIcon}>
                Spiele
              </NavItem>
              <NavItem to={`/${slug}/tipps`} icon={DicesIcon}>
                Tipps
              </NavItem>
              <NavItem to={`/${slug}/ergebnisse`} icon={ListChecksIcon}>
                Ergebnisse
              </NavItem>
              <NavItem to={`/${slug}/zusatzpunkte`} icon={StarIcon}>
                Zusatzpunkte
              </NavItem>
            </>
          ) : (
            <NavItem to="/start" icon={RocketIcon}>
              Start
            </NavItem>
          )}
        </nav>

        <div className="flex-1" />

        <div className="p-2">
          <p className="text-muted px-2 py-1 text-xs font-medium tracking-wider uppercase">
            Stammdaten
          </p>
          <nav className="mt-1 flex flex-col gap-1">
            <NavItem to="/turniere" icon={FoldersIcon}>
              Turniere
            </NavItem>
            <NavItem to="/spieler" icon={UsersIcon}>
              Spieler
            </NavItem>
            <NavItem to="/teams" icon={ShirtIcon}>
              Teams
            </NavItem>
            <NavItem to="/ligen" icon={ShieldIcon}>
              Ligen
            </NavItem>
            <NavItem to="/regelwerke" icon={PilcrowIcon}>
              Regelwerke
            </NavItem>
          </nav>
        </div>

        <div className="border-subtle border-t p-2">
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="text-app hover:bg-nav-active focus-visible:ring-accent flex w-full items-center gap-2.5 rounded-sm px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <LogOutIcon className="size-4 shrink-0" />
              Abmelden
            </button>
          </Form>
        </div>
      </div>
    </aside>
  );
}
