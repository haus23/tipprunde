import { createContext, use, useState } from "react";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

interface ShellContextType {
  isMobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function useShell() {
  const context = use(ShellContext);
  if (context === undefined) {
    throw new Error("useShell must be used within AppShell");
  }
  
  const { isMobileNavOpen, setMobileNavOpen } = context;
  
  return {
    isMobileNavOpen,
    toggleMobileNav: () => setMobileNavOpen(!isMobileNavOpen),
    closeMobileNav: () => setMobileNavOpen(false),
    openMobileNav: () => setMobileNavOpen(true),
  };
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <ShellContext value={{ isMobileNavOpen, setMobileNavOpen }}>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <AppHeader />
          <main className="px-2">{children}</main>
        </div>
      </div>
    </ShellContext>
  );
}
