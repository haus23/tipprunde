import { Link, NavLink } from "react-router";

import { Logo } from "#/components/logo.tsx";

type NavItemProps = {
  to: string;
  end?: boolean;
  children: React.ReactNode;
};

function NavItem({ to, end, children }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center rounded-sm px-2 py-1.5 text-sm transition-colors ${
          isActive ? "bg-nav-active text-accent" : "text-app hover:bg-nav-active"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

type SidebarProps = {
  slug: string | undefined;
};

export function Sidebar({ slug }: SidebarProps) {
  return (
    <aside className="border-subtle bg-surface-raised row-span-2 flex flex-col border-r">
      <Link to="/" className="border-subtle flex h-14 shrink-0 items-center gap-2.5 border-b px-4">
        <div className="text-accent size-7">
          <Logo />
        </div>
        <span className="text-sm font-semibold">runde.tips</span>
      </Link>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <nav className="flex flex-col gap-0.5 p-2">
          {slug && (
            <>
              <NavItem to={`/${slug}`} end>
                Übersicht
              </NavItem>
              <NavItem to={`/${slug}/spiele`}>Spiele</NavItem>
              <NavItem to={`/${slug}/tipps`}>Tipps</NavItem>
              <NavItem to={`/${slug}/ergebnisse`}>Ergebnisse</NavItem>
            </>
          )}
        </nav>

        <div className="flex-1" />

        <div className="p-2">
          <p className="text-muted px-2 py-1 text-xs font-medium tracking-wider uppercase">
            Stammdaten
          </p>
          <nav className="mt-1 flex flex-col gap-0.5">
            <NavItem to="/turniere">Turniere</NavItem>
            <NavItem to="/spieler">Spieler</NavItem>
          </nav>
        </div>

        <div className="border-subtle border-t p-2">
          <NavItem to="/logout">Abmelden</NavItem>
        </div>
      </div>
    </aside>
  );
}
