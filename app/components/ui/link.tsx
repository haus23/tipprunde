import type { NavLinkProps } from "react-router";
import { NavLink as _NavLink } from "react-router";
import { cva } from "~/utils/cva";

const navLinkClasses = cva({
  base: [
    "flex items-center gap-2.5 px-1.5 group-data-[sidebar-collapsed=true]:w-8 overflow-hidden",
    "[&>svg]:size-5 [&>svg]:shrink-0",
  ],
});

export function NavLink({ className, ...props }: NavLinkProps) {
  return <_NavLink className={navLinkClasses({ className })} {...props} />;
}
