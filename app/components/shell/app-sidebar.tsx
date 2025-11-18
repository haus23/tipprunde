import { Logo } from "./logo";
import { Link } from "~/components/ui/link";

export function AppSidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex flex-col gap-1 border-r border-default bg-raised pb-2 sticky top-0 h-screen overflow-y-auto">
      <div className="px-2 py-1 sticky top-0 bg-raised z-10">
        <Link
          to="/"
          className="flex items-center px-0.5 gap-1 group-data-[sidebar-collapsed=true]/shell:w-9 overflow-hidden"
        >
          <Logo className="size-8 shrink-0" />
          <span className="text-xl font-medium">runde.tips</span>
        </Link>
      </div>
      <div className="grow flex flex-col">{children}</div>
    </div>
  );
}
