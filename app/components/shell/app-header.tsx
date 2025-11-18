import { MenuIcon, PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useShell } from "./provider";

export function AppHeader({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, toggleSidebar, toggleMobileMenu } = useShell();
  return (
    <div className="h-8 flex items-center gap-4">
      {/* Mobile menu button */}
      <Button variant="ghost" onClick={toggleMobileMenu} className="md:hidden">
        <MenuIcon className="size-6" />
      </Button>

      {/* Desktop sidebar toggle */}
      <Button variant="ghost" onClick={toggleSidebar} className="hidden md:flex">
        {isSidebarCollapsed ? (
          <PanelLeftOpenIcon className="size-6" />
        ) : (
          <PanelLeftCloseIcon className="size-6" />
        )}
      </Button>

      <div>{children}</div>
    </div>
  );
}
