"use client";

import { Link, type LinkProps } from "@tanstack/react-router";
import { Focusable, Tooltip, TooltipTrigger } from "react-aria-components";
import {
  CalendarIcon,
  DicesIcon,
  FoldersIcon,
  ListChecksIcon,
  LogOutIcon,
  PilcrowIcon,
  ShieldIcon,
  ShirtIcon,
  StarIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { logoutFn } from "#/app/(auth)/session.ts";
import { Logo } from "#/components/logo.tsx";
import { useShell } from "#/components/manager/shell-provider.tsx";

export const SIDEBAR_WIDTH = 208;
export const SIDEBAR_WIDTH_COLLAPSED = 56;

const transition = { type: "spring", bounce: 0, duration: 0.3 } as const;

interface NavItemProps extends Partial<LinkProps> {
  icon: React.ReactNode;
  label: string;
}

const tooltipClass =
  "rounded-sm bg-inverted px-2 py-1 text-inverted text-sm data-[entering]:animate-[tooltip-enter_120ms_ease-out] data-[exiting]:animate-[tooltip-exit_100ms_ease-in]";

function NavItem({ icon, label, to, ...linkProps }: NavItemProps) {
  const { isSidebarCollapsed } = useShell();

  const className =
    "hover:bg-subtle flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-focus";

  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      <motion.span
        animate={{ opacity: isSidebarCollapsed ? 0 : 1, width: isSidebarCollapsed ? 0 : "auto" }}
        transition={transition}
        className="overflow-hidden whitespace-nowrap"
      >
        {label}
      </motion.span>
    </>
  );

  const element = !to ? (
    <span className={`${className} text-subtle cursor-default`}>{content}</span>
  ) : (
    <Link {...linkProps} to={to} activeProps={{ className: "bg-subtle" }} className={className}>
      {content}
    </Link>
  );

  return (
    <TooltipTrigger delay={750} isDisabled={!isSidebarCollapsed}>
      <Focusable>{element}</Focusable>
      <Tooltip placement="right" offset={6} className={tooltipClass}>
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}

export function Sidebar({ slug }: { slug: string | undefined }) {
  const { isSidebarCollapsed } = useShell();

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
      transition={transition}
      className="border-layout fixed inset-y-0 left-0 flex flex-col overflow-x-hidden border-r"
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center px-3">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <span className="size-8 shrink-0">
            <Logo />
          </span>
          <motion.span
            animate={{
              opacity: isSidebarCollapsed ? 0 : 1,
              width: isSidebarCollapsed ? 0 : "auto",
            }}
            transition={transition}
            className="overflow-hidden font-medium whitespace-nowrap"
          >
            runde.tips
          </motion.span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        <NavItem
          icon={<TrophyIcon size={16} />}
          label="Turnier"
          to="/manager/{-$slug}"
          params={slug ? { slug } : {}}
          activeOptions={{ exact: true }}
        />
        <NavItem
          icon={<CalendarIcon size={16} />}
          label="Spiele"
          to="/manager/{-$slug}/spiele"
          params={slug ? { slug } : {}}
        />
        <NavItem icon={<DicesIcon size={16} />} label="Tipps" />
        <NavItem icon={<ListChecksIcon size={16} />} label="Ergebnisse" />
        <NavItem icon={<StarIcon size={16} />} label="Zusatzpunkte" />

        {/* Stammdaten */}
        <div className="mt-auto flex flex-col gap-1">
          <motion.div
            animate={{
              opacity: isSidebarCollapsed ? 0 : 1,
              height: isSidebarCollapsed ? 0 : "auto",
            }}
            transition={transition}
            className="text-subtle overflow-hidden px-3 py-1 text-xs font-medium tracking-wide uppercase"
          >
            Stammdaten
          </motion.div>
          <NavItem
            icon={<FoldersIcon size={16} />}
            label="Turniere"
            to="/manager/stammdaten/turniere"
          />
          <NavItem icon={<UsersIcon size={16} />} label="Spieler" />
          <NavItem icon={<ShirtIcon size={16} />} label="Teams" />
          <NavItem icon={<ShieldIcon size={16} />} label="Ligen" />
          <NavItem icon={<PilcrowIcon size={16} />} label="Regelwerke" />
        </div>
      </nav>

      {/* Footer */}
      <div className="border-layout shrink-0 border-t p-2">
        <TooltipTrigger delay={750} isDisabled={!isSidebarCollapsed}>
          <Focusable>
            <button
              onClick={() => logoutFn()}
              className="hover:bg-subtle focus-visible:ring-focus flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm outline-none focus-visible:ring-2"
            >
              <LogOutIcon size={16} className="shrink-0" />
              <motion.span
                animate={{
                  opacity: isSidebarCollapsed ? 0 : 1,
                  width: isSidebarCollapsed ? 0 : "auto",
                }}
                transition={transition}
                className="overflow-hidden whitespace-nowrap"
              >
                Abmelden
              </motion.span>
            </button>
          </Focusable>
          <Tooltip placement="right" offset={6} className={tooltipClass}>
            Abmelden
          </Tooltip>
        </TooltipTrigger>
      </div>
    </motion.aside>
  );
}
