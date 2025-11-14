import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useShell } from "./provider";

export function AppHeader({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, toggleSidebar } = useShell();
  return (
    <div className="h-8 flex items-center gap-4">
      <Button variant="ghost" onClick={toggleSidebar}>
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
