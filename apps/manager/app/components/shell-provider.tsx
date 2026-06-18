import { createContext, use, useCallback, useState } from "react";
import { useFetcher } from "react-router";

interface ShellContextType {
  isSidebarCollapsed: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const ShellContext = createContext<ShellContextType | null>(null);

interface Props {
  initialSidebarCollapsed: boolean;
  children: React.ReactNode;
}

export function ShellProvider({ initialSidebarCollapsed, children }: Props) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(initialSidebarCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fetcher = useFetcher();

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      // Optimistic: state flips now; cookie persists via the action route.
      void fetcher.submit(
        { collapsed: String(next) },
        { method: "post", action: "/manager-shell" },
      );
      return next;
    });
  }, [fetcher]);

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <ShellContext
      value={{
        isSidebarCollapsed,
        isMobileMenuOpen,
        toggleSidebar,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </ShellContext>
  );
}

export function useShell() {
  const context = use(ShellContext);
  if (!context) throw new Error("useShell must be used within ShellProvider");
  return context;
}
