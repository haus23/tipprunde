import logoUrl from "#/assets/logo.svg?no-inline";
import { cx } from "#/lib/cva.ts";

export function Logo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      role="img"
      aria-label="runde.tips Logo"
      className={cx("size-full fill-current", className)}
      {...props}
    >
      <use href={`${logoUrl}#logo`} />
    </svg>
  );
}
