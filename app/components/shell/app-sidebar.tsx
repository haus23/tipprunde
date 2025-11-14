import { Link } from "react-router";
import { Logo } from "./logo";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-r border-default bg-raised pb-2">
      <div className="p-2">
        <Link
          to="/"
          className="flex items-center gap-1 group-data-[sidebar-collapsed=true]:w-8 overflow-hidden"
        >
          <Logo className="size-8 shrink-0" />
          <span className="text-xl font-medium">runde.tips</span>
        </Link>
      </div>
      <div className="grow flex flex-col">{children}</div>
    </div>
  );
}
