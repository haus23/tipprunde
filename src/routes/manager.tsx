import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Logo } from "@/components/logo.tsx";
import { requireManager } from "@/lib/auth/functions.ts";

export const Route = createFileRoute("/manager")({
  beforeLoad: async () => {
    const user = await requireManager();
    return { user };
  },
  component: ManagerLayout,
});

function ManagerLayout() {
  return (
    <div className="flex min-h-svh">
      <aside className="border-input fixed inset-y-0 left-0 hidden w-52 flex-col overflow-y-auto border-r md:flex">
        <div className="border-input flex h-14 shrink-0 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="size-10">
              <Logo />
            </span>
            <span className="text-lg font-medium">runde.tips</span>
          </Link>
        </div>
      </aside>
      <main className="flex-1 md:ml-52">
        <header className="border-layout fixed inset-x-0 top-0 flex h-14 items-center justify-center border-b md:left-52">
          <span className="text-sm font-medium">{headerTitle}</span>
        </header>
        <div className="pt-14">
          <div className="p-4 md:p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
