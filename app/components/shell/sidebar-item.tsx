import { Focusable, Tooltip, TooltipTrigger } from "react-aria-components";
import { useShell } from "./provider";
import { cx } from "~/utils/cva";

export function SidebarItem({
  tooltip,
  children,
}: {
  tooltip: string;
  children: React.ReactElement<React.DOMAttributes<Element>, string>;
}) {
  const { isSidebarCollapsed } = useShell();
  return (
    <TooltipTrigger delay={750} isDisabled={!isSidebarCollapsed}>
      <Focusable>{children}</Focusable>
      <Tooltip
        placement="right"
        offset={6}
        className={cx("rounded-sm bg-emphasis px-2 py-1 text-emphasis text-sm")}
      >
        {tooltip}
      </Tooltip>
    </TooltipTrigger>
  );
}
