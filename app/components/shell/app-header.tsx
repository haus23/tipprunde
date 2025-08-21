import { PanelLeftIcon } from "lucide-react";
import { useShell } from "./app-shell";

export function AppHeader() {
  const { toggleMobileNav } = useShell();

  return (
    <header className="h-14 flex items-center px-2">
      <div>
        <button
          onClick={toggleMobileNav}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors md:hidden"
          aria-label="Toggle mobile navigation"
        >
          <PanelLeftIcon className="size-5" />
        </button>
      </div>
    </header>
  );
}
