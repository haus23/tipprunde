import { PanelLeftIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useShell } from "./app-shell";

export function AppHeader() {
  const { toggleMobileNav } = useShell();

  return (
    <header className="h-14 flex items-center px-2">
      <div>
        <Button
          onPress={toggleMobileNav}
          variant="ghost"
          size="sm"
          className="md:hidden"
          aria-label="Toggle mobile navigation"
        >
          <PanelLeftIcon className="size-5" />
        </Button>
      </div>
    </header>
  );
}
