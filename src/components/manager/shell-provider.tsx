"use client";

import { use, useCallback, useEffect, useState } from "react";
import { createContext } from "react";

import { updateManagerShellSettingsFn } from "#/app/settings/manager-shell.ts";

interface ShellContextType {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
}

const ShellContext = createContext<ShellContextType | null>(null);

interface Props {
  initialSidebarCollapsed: boolean;
  children: React.ReactNode;
}

const SIDEBAR_KEY = "manager-sidebar-collapsed";

export function ShellProvider({ initialSidebarCollapsed, children }: Props) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(initialSidebarCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored !== null) setIsSidebarCollapsed(stored === "true");
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      updateManagerShellSettingsFn({ data: { sidebarCollapsed: next } });
      return next;
    });
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  return (
    <ShellContext value={{ isSidebarCollapsed, isMobileMenuOpen, toggleSidebar, toggleMobileMenu }}>
      {children}
    </ShellContext>
  );
}

export function useShell() {
  const context = use(ShellContext);
  if (!context) throw new Error("useShell must be used within ShellProvider");
  return context;
}
