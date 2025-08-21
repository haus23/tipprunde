import { PanelLeftIcon } from "lucide-react";

export function AppHeader() {
  return (
    <header className="h-14 flex items-center px-2">
      <div>
        <button>
          <PanelLeftIcon className="size-5" />
        </button>
      </div>
    </header>
  );
}
