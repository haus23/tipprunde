import { createContext, use, useCallback, useState } from 'react';

import { useSettings } from '~/utils/prefs';

type ShellContextType = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileNavOpen: boolean;
  setMobileNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShellContext = createContext<ShellContextType>(undefined as never);

export function useShell() {
  const { settings, setSettings } = useSettings();
  const context = use(ShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within the AppShell.');
  }

  const {
    isSidebarCollapsed,
    setSidebarCollapsed,
    isMobileNavOpen,
    setMobileNavOpen,
  } = context;

  const toggleSidebar = useCallback(async () => {
    setSidebarCollapsed(!settings.sidebarCollapsed);
    await setSettings({
      ...settings,
      sidebarCollapsed: !settings.sidebarCollapsed,
    });
  }, [settings, setSettings, setSidebarCollapsed]);

  const toggleMobileNav = useCallback(() => {
    setMobileNavOpen((state) => !state);
  }, [setMobileNavOpen]);

  return {
    isSidebarCollapsed,
    toggleSidebar,
    isMobileNavOpen,
    setMobileNavOpen,
    toggleMobileNav,
  };
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    settings.sidebarCollapsed,
  );
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ShellContext
      value={{
        isSidebarCollapsed,
        setSidebarCollapsed,
        isMobileNavOpen,
        setMobileNavOpen,
      }}
    >
      {children}
    </ShellContext>
  );
}
