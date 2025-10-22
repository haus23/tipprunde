import type { NavLinkProps } from "react-router";
import { NavLink as _NavLink } from "react-router";
import { cva } from "~/utils/cva";

const navLinkClasses = cva({
  base: "flex items-center gap-2 px-1",
});

export function NavLink({ className, ...props }: NavLinkProps) {
  return <_NavLink className={navLinkClasses({ className })} {...props} />;
}
