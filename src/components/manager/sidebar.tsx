"use client";

import { Link, type LinkProps, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
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
import { Dialog, Modal, ModalOverlay, Tooltip, TooltipTrigger } from "react-aria-components";

import { logoutFn } from "#/app/(auth)/session.ts";
import { Logo } from "#/components/logo.tsx";
import { useShell } from "#/components/manager/shell-provider.tsx";

export const SIDEBAR_WIDTH = 208;
export const SIDEBAR_WIDTH_COLLAPSED = 56;

const transition = { type: "spring", bounce: 0, duration: 0.3 } as const;

const tooltipClass =
  "rounded-sm bg-inverted px-2 py-1 text-inverted text-sm data-[entering]:animate-[tooltip-enter_120ms_ease-out] data-[exiting]:animate-[tooltip-exit_100ms_ease-in]";

interface NavItemProps extends Partial<LinkProps> {
  icon: React.ReactNode;
  label: string;
  collapsed?: boolean;
}

function NavItem({ icon, label, to, collapsed: collapsedProp, ...linkProps }: NavItemProps) {
  const { isSidebarCollapsed } = useShell();
  const isCollapsed = collapsedProp ?? isSidebarCollapsed;

  const className =
    "hover:bg-subtle flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-focus";

  const content = (
    <>
      <span className="shrink-0">{icon}</span>
      <motion.span
        animate={{ opacity: isCollapsed ? 0 : 1, width: isCollapsed ? 0 : "auto" }}
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
    <TooltipTrigger delay={750} isDisabled={!isCollapsed}>
      {element}
      <Tooltip placement="right" offset={6} className={tooltipClass}>
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}

function NavContent({ slug, collapsed }: { slug: string | undefined; collapsed: boolean }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
      <NavItem
        collapsed={collapsed}
        icon={<TrophyIcon size={16} />}
        label="Turnier"
        to="/manager/{-$slug}"
        params={slug ? { slug } : {}}
        activeOptions={{ exact: true }}
      />
      <NavItem
        collapsed={collapsed}
        icon={<CalendarIcon size={16} />}
        label="Spiele"
        to="/manager/{-$slug}/spiele"
        params={slug ? { slug } : {}}
      />
      <NavItem collapsed={collapsed} icon={<DicesIcon size={16} />} label="Tipps" />
      <NavItem collapsed={collapsed} icon={<ListChecksIcon size={16} />} label="Ergebnisse" />
      <NavItem collapsed={collapsed} icon={<StarIcon size={16} />} label="Zusatzpunkte" />

      <div className="mt-auto flex flex-col gap-1">
        <motion.div
          animate={{ opacity: collapsed ? 0 : 1, height: collapsed ? 0 : "auto" }}
          transition={transition}
          className="text-subtle overflow-hidden px-3 py-1 text-xs font-medium tracking-wide uppercase"
        >
          Stammdaten
        </motion.div>
        <NavItem
          collapsed={collapsed}
          icon={<FoldersIcon size={16} />}
          label="Turniere"
          to="/manager/stammdaten/turniere"
        />
        <NavItem collapsed={collapsed} icon={<UsersIcon size={16} />} label="Spieler" />
        <NavItem collapsed={collapsed} icon={<ShirtIcon size={16} />} label="Teams" />
        <NavItem collapsed={collapsed} icon={<ShieldIcon size={16} />} label="Ligen" />
        <NavItem collapsed={collapsed} icon={<PilcrowIcon size={16} />} label="Regelwerke" />
      </div>
    </nav>
  );
}

export function Sidebar({ slug }: { slug: string | undefined }) {
  const { isSidebarCollapsed } = useShell();

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
      transition={transition}
      className="border-layout fixed inset-y-0 left-0 hidden flex-col overflow-x-hidden border-r md:flex"
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

      <NavContent slug={slug} collapsed={isSidebarCollapsed} />

      {/* Footer */}
      <div className="border-layout shrink-0 border-t p-2">
        <TooltipTrigger delay={750} isDisabled={!isSidebarCollapsed}>
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
          <Tooltip placement="right" offset={6} className={tooltipClass}>
            Abmelden
          </Tooltip>
        </TooltipTrigger>
      </div>
    </motion.aside>
  );
}

const MotionModalOverlay = motion.create(ModalOverlay);
const MotionModal = motion.create(Modal);

const drawerTransition = { type: "spring", bounce: 0, duration: 0.3 } as const;

export function MobileNav({ slug }: { slug: string | undefined }) {
  const { isMobileMenuOpen, closeMobileMenu } = useShell();
  const pathname = useRouterState({ select: (s) => s.resolvedLocation?.pathname });
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <MotionModalOverlay
          isOpen
          onOpenChange={(open) => { if (!open) closeMobileMenu(); }}
          isDismissable
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/40"
        >
          <MotionModal
            initial={{ x: -SIDEBAR_WIDTH }}
            animate={{ x: 0 }}
            exit={{ x: -SIDEBAR_WIDTH }}
            transition={drawerTransition}
            className="bg-base fixed inset-y-0 left-0 flex w-52 flex-col"
          >
            <Dialog aria-label="Navigation" className="flex h-full flex-col outline-none">
              {/* Logo */}
              <div className="flex h-14 shrink-0 items-center px-3">
                <Link to="/" className="flex items-center gap-3">
                  <span className="size-8 shrink-0">
                    <Logo />
                  </span>
                  <span className="overflow-hidden font-medium whitespace-nowrap">runde.tips</span>
                </Link>
              </div>

              <div className="flex flex-1 flex-col" onClick={closeMobileMenu}>
                <NavContent slug={slug} collapsed={false} />
              </div>

              {/* Footer */}
              <div className="border-layout shrink-0 border-t p-2">
                <button
                  onClick={() => logoutFn()}
                  className="hover:bg-subtle focus-visible:ring-focus flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm outline-none focus-visible:ring-2"
                >
                  <LogOutIcon size={16} className="shrink-0" />
                  <span className="whitespace-nowrap">Abmelden</span>
                </button>
              </div>
            </Dialog>
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  );
}
