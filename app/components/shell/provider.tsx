import { createContext, use, useCallback, useState } from "react";
import { useSettings } from "~/lib/prefs/settings";

type ShellContextType = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShellContext = createContext<ShellContextType>(undefined as never);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    settings.sidebarCollapsed,
  );
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ShellContext
      value={{
        isSidebarCollapsed,
        setSidebarCollapsed,
        isMobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </ShellContext>
  );
}

export function useShell() {
  const context = use(ShellContext);
  const { setSettings } = useSettings();

  if (!context) {
    throw new Error("useShell must be used within the ShellProvider.");
  }

  const { isSidebarCollapsed, setSidebarCollapsed, isMobileMenuOpen, setMobileMenuOpen } = context;

  const toggleSidebar = useCallback(async () => {
    const sidebarCollapsed = !isSidebarCollapsed;
    setSidebarCollapsed(sidebarCollapsed);
    await setSettings({ sidebarCollapsed });
  }, [isSidebarCollapsed, setSidebarCollapsed, setSettings]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, [setMobileMenuOpen]);

  return {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileMenuOpen,
    setMobileMenuOpen,
    toggleMobileMenu,
  };
}
