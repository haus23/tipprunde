import { cx } from "~/utils/cva";

const SIDEBAR_WIDTH = "12rem";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={
        {
          "--sidebar-width": SIDEBAR_WIDTH,
        } as React.CSSProperties
      }
      className={cx(
        "group isolate min-h-svh w-full",
        "grid grid-cols-[var(--sidebar-width)_1fr]",
      )}
    >
      {children}
    </div>
  );
}
