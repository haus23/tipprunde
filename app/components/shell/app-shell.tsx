import { cx } from "~/utils/cva";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cx(
        "group isolate min-h-svh w-full",
        "grid grid-cols-[12rem_1fr]",
      )}
    >
      {children}
    </div>
  );
}
