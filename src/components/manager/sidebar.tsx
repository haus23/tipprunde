"use client";

import { Link, type LinkProps, useNavigate, useRouterState } from "@tanstack/react-router";
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
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import {
  Dialog,
  Focusable,
  Modal,
  ModalOverlay,
  Tooltip,
  TooltipTrigger,
} from "react-aria-components";

import { logout } from "#/app/(auth)/logout.ts";
import { Logo } from "#/components/logo.tsx";
import { useShell } from "#/components/manager/shell-provider.tsx";
import { cn } from "#/utils/cn.ts";

export const SIDEBAR_WIDTH = 208;
export const SIDEBAR_WIDTH_COLLAPSED = 56;

const transition = { type: "spring", bounce: 0, duration: 0.3 } as const;

const tooltipClass =
  "rounded-sm bg-inverted px-2 py-1 text-inverted text-sm data-entering:animate-[tooltip-enter_120ms_ease-out_backwards] data-exiting:animate-[tooltip-exit_100ms_ease-in_forwards]";

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

  if (!to || !isCollapsed) {
    return element;
  }

  return (
    <TooltipTrigger delay={750}>
      <Focusable>{element}</Focusable>
      <Tooltip placement="right" offset={6} className={tooltipClass}>
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}

function NavContent({
  slug,
  collapsed,
  scroll = true,
}: {
  slug: string | undefined;
  collapsed: boolean;
  scroll?: boolean;
}) {
  return (
    <nav className={cn("flex flex-1 flex-col gap-1 p-2", scroll && "overflow-y-auto")}>
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
      <NavItem
        collapsed={collapsed}
        icon={<DicesIcon size={16} />}
        label="Tipps"
        to="/manager/{-$slug}/tipps"
        params={slug ? { slug } : {}}
      />
      <NavItem
        collapsed={collapsed}
        icon={<ListChecksIcon size={16} />}
        label="Ergebnisse"
        to="/manager/{-$slug}/ergebnisse"
        params={slug ? { slug } : {}}
      />
      <NavItem
        collapsed={collapsed}
        icon={<StarIcon size={16} />}
        label="Zusatzpunkte"
        to="/manager/{-$slug}/zusatzpunkte"
        params={slug ? { slug } : {}}
      />

      <div className="mt-auto flex flex-col gap-1 pt-4">
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
        <NavItem
          collapsed={collapsed}
          icon={<UsersIcon size={16} />}
          label="Spieler"
          to="/manager/stammdaten/spieler"
        />
        <NavItem
          collapsed={collapsed}
          icon={<ShirtIcon size={16} />}
          label="Teams"
          to="/manager/stammdaten/teams"
        />
        <NavItem
          collapsed={collapsed}
          icon={<ShieldIcon size={16} />}
          label="Ligen"
          to="/manager/stammdaten/ligen"
        />
        <NavItem
          collapsed={collapsed}
          icon={<PilcrowIcon size={16} />}
          label="Regelwerke"
          to="/manager/stammdaten/regelwerke"
        />
      </div>
    </nav>
  );
}

export function Sidebar({ slug }: { slug: string | undefined }) {
  const { isSidebarCollapsed } = useShell();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate({ to: "/" });
  }

  return (
    <motion.aside
      animate={{ width: isSidebarCollapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH }}
      transition={transition}
      className="border-layout fixed inset-y-0 left-0 hidden flex-col border-r md:flex"
    >
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center p-2">
        <Link to="/" className="flex w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-focus">
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

      <div className="flex flex-1 flex-col overflow-y-auto">
        <NavContent slug={slug} collapsed={isSidebarCollapsed} scroll={false} />

        {/* Footer */}
        <div className="border-layout mt-auto border-t p-2">
          <TooltipTrigger delay={750} isDisabled={!isSidebarCollapsed}>
            <Focusable>
              <button
                onClick={handleLogout}
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
      </div>
    </motion.aside>
  );
}

const MotionModalOverlay = motion.create(ModalOverlay);
const MotionModal = motion.create(Modal);

const drawerTransition = { type: "spring", bounce: 0, duration: 0.3 } as const;

export function MobileNav({ slug }: { slug: string | undefined }) {
  const { isMobileMenuOpen, closeMobileMenu } = useShell();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate({ to: "/" });
  }
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
          onOpenChange={(open) => {
            if (!open) closeMobileMenu();
          }}
          isDismissable
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
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
              <div className="flex h-14 shrink-0 items-center p-2">
                <Link to="/" className="flex w-full items-center gap-2 rounded-md px-2 py-1 outline-none focus-visible:ring-2 focus-visible:ring-focus">
                  <span className="size-8 shrink-0">
                    <Logo />
                  </span>
                  <span className="overflow-hidden font-medium whitespace-nowrap">runde.tips</span>
                </Link>
              </div>

              <div
                className="flex min-h-0 flex-1 flex-col overflow-y-auto"
                onClick={closeMobileMenu}
              >
                <NavContent slug={slug} collapsed={false} scroll={false} />

                {/* Footer */}
                <div className="border-layout mt-auto border-t p-2">
                  <button
                    onClick={handleLogout}
                    className="hover:bg-subtle focus-visible:ring-focus flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm outline-none focus-visible:ring-2"
                  >
                    <LogOutIcon size={16} className="shrink-0" />
                    <span className="whitespace-nowrap">Abmelden</span>
                  </button>
                </div>
              </div>
            </Dialog>
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  );
}
