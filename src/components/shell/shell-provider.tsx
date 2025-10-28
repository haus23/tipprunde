import { createContext, use, useCallback, useState } from "react";

type ShellContextType = {
  isSidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

const ShellContext = createContext<ShellContextType>(undefined as never);

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

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
  if (!context) {
    throw new Error("useShell must be used within the ShellProvider.");
  }

  const { isSidebarCollapsed, setSidebarCollapsed } = context;

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((state) => !state);
  }, [setSidebarCollapsed]);

  return {
    isSidebarCollapsed,
    toggleSidebar,
  };
}
