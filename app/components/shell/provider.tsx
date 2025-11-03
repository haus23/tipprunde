import { createContext, use, useCallback, useState } from "react";
import { useSettings } from "~/lib/prefs/settings";

type ShellContextType = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShellContext = createContext<ShellContextType>(undefined as never);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(
    settings.sidebarCollapsed,
  );

  return (
    <ShellContext
      value={{
        isSidebarCollapsed,
        setSidebarCollapsed,
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

  const { isSidebarCollapsed, setSidebarCollapsed } = context;

  const toggleSidebar = useCallback(async () => {
    const sidebarCollapsed = !isSidebarCollapsed;
    setSidebarCollapsed(sidebarCollapsed);
    await setSettings({ sidebarCollapsed });
  }, [isSidebarCollapsed, setSidebarCollapsed]);

  return {
    isSidebarCollapsed,
    toggleSidebar,
  };
}
