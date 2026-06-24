import { Button, Logo } from "@tipprunde/ui";
import { cx } from "@tipprunde/ui";
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
import { Focusable, Tooltip, TooltipTrigger } from "react-aria-components";
import { Form, NavLink } from "react-router";

import { useShell } from "#/components/shell-provider.tsx";

const tooltipClass =
  "bg-inverted text-inverted rounded-sm px-2 py-1 text-xs shadow-popover transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0";

type NavItemProps = {
  to: string;
  end?: boolean;
  icon: LucideIcon;
  label: string;
  collapsed: boolean;
  onNavigate?: () => void;
};

function NavItem({ to, end, icon: Icon, label, collapsed, onNavigate }: NavItemProps) {
  const link = (
    <NavLink
      to={to}
      end={end}
      onClick={onNavigate}
      className={cx(
        "group flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
        "text-app hover:bg-nav-active",
        "aria-[current=page]:bg-nav-active",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
      )}
    >
      <Icon className="group-aria-[current=page]:text-accent size-4 shrink-0" />
      <span
        className={cx(
          "overflow-hidden whitespace-nowrap transition-opacity duration-200",
          collapsed ? "opacity-0" : "opacity-100",
        )}
      >
        {label}
      </span>
    </NavLink>
  );

  if (!collapsed) return link;

  return (
    <TooltipTrigger delay={600}>
      <Focusable>{link}</Focusable>
      <Tooltip placement="right" offset={6} className={tooltipClass}>
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}

type SidebarNavProps = {
  slug: string | undefined;
  collapsed: boolean;
  onNavigate?: () => void;
};

/** Shared nav body for the persistent sidebar (rail) and the mobile drawer. */
export function SidebarNav({ slug, collapsed, onNavigate }: SidebarNavProps) {
  const logoutButton = (
    <Button
      type="submit"
      intent="ghost"
      aria-label="Abmelden"
      className="text-app w-full justify-start gap-2.5 px-3"
    >
      <LogOutIcon className="size-4 shrink-0" />
      <span
        className={cx(
          "overflow-hidden whitespace-nowrap transition-opacity duration-200",
          collapsed ? "opacity-0" : "opacity-100",
        )}
      >
        Abmelden
      </span>
    </Button>
  );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <nav className="flex flex-col gap-1 p-2">
        {slug ? (
          <>
            <NavItem
              to={`/${slug}`}
              end
              icon={TrophyIcon}
              label="Turnier"
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavItem
              to={`/${slug}/spiele`}
              icon={CalendarIcon}
              label="Spiele"
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavItem
              to={`/${slug}/tipps`}
              icon={DicesIcon}
              label="Tipps"
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavItem
              to={`/${slug}/ergebnisse`}
              icon={ListChecksIcon}
              label="Ergebnisse"
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
            <NavItem
              to={`/${slug}/zusatzfragen`}
              icon={StarIcon}
              label="Zusatzfragen"
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          </>
        ) : (
          <NavItem
            to="/start"
            icon={RocketIcon}
            label="Start"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        )}
      </nav>

      <div className="flex-1" />

      <div className="p-2">
        <p
          className={cx(
            "text-muted overflow-hidden px-2 py-1 text-xs font-medium tracking-wider whitespace-nowrap uppercase transition-opacity duration-200",
            collapsed && "opacity-0",
          )}
        >
          Stammdaten
        </p>
        <nav className="mt-1 flex flex-col gap-1">
          <NavItem
            to="/turniere"
            icon={FoldersIcon}
            label="Turniere"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavItem
            to="/spieler"
            icon={UsersIcon}
            label="Spieler"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavItem
            to="/teams"
            icon={ShirtIcon}
            label="Teams"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavItem
            to="/ligen"
            icon={ShieldIcon}
            label="Ligen"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <NavItem
            to="/regelwerke"
            icon={PilcrowIcon}
            label="Regelwerke"
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </nav>
      </div>

      <div className="border-subtle border-t p-2">
        <Form method="post" action="/logout">
          {collapsed ? (
            <TooltipTrigger delay={600}>
              <Focusable>{logoutButton}</Focusable>
              <Tooltip placement="right" offset={6} className={tooltipClass}>
                Abmelden
              </Tooltip>
            </TooltipTrigger>
          ) : (
            logoutButton
          )}
        </Form>
      </div>
    </div>
  );
}

type SidebarProps = {
  slug: string | undefined;
  webAppUrl: string;
};

/** Persistent sidebar (md+), collapsible between full (208px) and rail (56px). */
export function Sidebar({ slug, webAppUrl }: SidebarProps) {
  const { isSidebarCollapsed } = useShell();

  return (
    <aside className="border-subtle bg-surface-raised row-span-2 hidden flex-col overflow-hidden border-r md:flex">
      <div className="border-subtle flex h-14 shrink-0 items-center border-b px-2">
        <a
          href={webAppUrl}
          className="hover:bg-nav-active focus-visible:ring-accent flex h-9 w-full items-center gap-2.5 rounded-sm px-2 focus-visible:ring-2 focus-visible:outline-none"
        >
          <div className="text-accent size-7 shrink-0">
            <Logo />
          </div>
          <span
            className={cx(
              "overflow-hidden text-sm font-semibold whitespace-nowrap transition-opacity duration-200",
              isSidebarCollapsed ? "opacity-0" : "opacity-100",
            )}
          >
            runde.tips
          </span>
        </a>
      </div>

      <SidebarNav slug={slug} collapsed={isSidebarCollapsed} />
    </aside>
  );
}
