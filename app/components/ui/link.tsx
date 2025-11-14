import type { LinkProps, NavLinkProps } from "react-router";
import { Link as _Link, NavLink as _NavLink } from "react-router";
import { cva } from "~/utils/cva";

const linkClasses = cva({
  base: [
    "p-1 rounded-md",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
  ],
});

const navLinkClasses = cva({
  base: [
    "flex items-center gap-2.5 px-2 py-1 rounded-md group-data-[sidebar-collapsed=true]/shell:w-9 overflow-hidden ",
    "[&>svg]:size-5 [&>svg]:shrink-0",
    "text-secondary hover:text-primary hover:bg-overlay",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
  ],
});

export function Link({ className, ...props }: LinkProps) {
  return <_Link className={linkClasses({ className })} {...props} />;
}

export function NavLink({ className, ...props }: NavLinkProps) {
  return <_NavLink className={navLinkClasses({ className })} {...props} />;
}
