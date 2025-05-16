import { createContext, use, useCallback, useState } from 'react';

import { useSettings } from '~/utils/prefs';

type ShellContextType = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShellContext = createContext<ShellContextType>(undefined as never);

export function useShell() {
  const { settings, setSettings } = useSettings();
  const context = use(ShellContext);
  if (!context) {
    throw new Error('useAppShell must be used within the AppShell.');
  }

  const { isSidebarCollapsed, setSidebarCollapsed } = context;

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((state) => !state);
    setSettings({ ...settings, sidebarCollapsed: !settings.sidebarCollapsed });
  }, [settings, setSettings, setSidebarCollapsed]);

  return {
    isSidebarCollapsed,
    toggleSidebar,
  };
}

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    settings.sidebarCollapsed,
  );

  return (
    <ShellContext value={{ isSidebarCollapsed, setSidebarCollapsed }}>
      {children}
    </ShellContext>
  );
}
