import { PanelLeftIcon } from "lucide-react";
import { Button } from "react-aria-components";
import { useShell } from "./app-shell";

export function AppHeader() {
  const { toggleMobileNav } = useShell();

  return (
    <header className="h-14 flex items-center px-2">
      <div>
        <Button
          onPress={toggleMobileNav}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors md:hidden active:bg-gray-200"
          aria-label="Toggle mobile navigation"
        >
          <PanelLeftIcon className="size-5" />
        </Button>
      </div>
    </header>
  );
}
