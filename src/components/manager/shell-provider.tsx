import { use, useCallback, useState } from "react";
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

export function ShellProvider({ initialSidebarCollapsed, children }: Props) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(initialSidebarCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      updateManagerShellSettingsFn({ data: { sidebarCollapsed: !prev } });
      return !prev;
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
