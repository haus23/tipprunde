import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useShell } from "./shell-provider";

export function AppHeader({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, toggleSidebar } = useShell();
  return (
    <div className="h-8 flex items-center gap-4">
      <Button onPress={toggleSidebar}>
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
