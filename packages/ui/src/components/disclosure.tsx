import { ChevronDownIcon } from "lucide-react";
import { useId, type ReactNode } from "react";

import { cx } from "#/lib/cva.ts";

interface Props {
  name?: string;
  title: ReactNode;
  meta?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
  summaryClassName?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function Disclosure({
  name,
  title,
  meta,
  defaultOpen,
  className,
  summaryClassName,
  bodyClassName,
  children,
}: Props) {
  const generatedId = useId();
  const resolvedName = name ?? generatedId;

  return (
    <details name={resolvedName} open={defaultOpen} className={cx("group", className)}>
      <summary
        className={cx(
          "flex cursor-pointer list-none items-center justify-between",
          "xs:px-3 px-2 py-3 outline-none select-none",
          "transition-colors hover:bg-surface-raised",
          "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
          "[&::-webkit-details-marker]:hidden",
          summaryClassName,
        )}
      >
        <span className="text-sm font-medium">{title}</span>
        <span className="flex items-center gap-3">
          {meta}
          <ChevronDownIcon className="text-subtle size-3.5 shrink-0 transition-transform duration-200 ease-out group-open:rotate-180" />
        </span>
      </summary>
      <div className={cx("xs:px-3 px-2 pb-3", bodyClassName)}>{children}</div>
    </details>
  );
}
