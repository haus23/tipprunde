import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <AppHeader />
        <main className="px-2">{children}</main>
      </div>
    </div>
  );
}
