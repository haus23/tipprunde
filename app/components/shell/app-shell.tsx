import { cx } from "~/utils/cva";
import { useShell } from "./provider";

const SIDEBAR_WIDTH = "12rem";
const SIDEBAR_COLLAPSED_WIDTH = "3rem";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useShell();
  return (
    <div
      style={
        {
          "--sidebar-width": isSidebarCollapsed
            ? SIDEBAR_COLLAPSED_WIDTH
            : SIDEBAR_WIDTH,
        } as React.CSSProperties
      }
      className={cx(
        "group isolate min-h-svh w-full",
        "grid grid-cols-[var(--sidebar-width)_1fr]",
      )}
      {...(isSidebarCollapsed && { "data-sidebar-collapsed": true })}
    >
      {children}
    </div>
  );
}
