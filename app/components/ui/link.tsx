import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps as RouterLinkProps,
  type NavLinkProps as RouterNavLinkProps,
} from "react-router";
import { cva, type VariantProps } from "~/utils/cva";

const linkClasses = cva({
  base: "flex items-center gap-2 p-1 rounded-md text-sm font-medium transition-colors",
  variants: {
    variant: {
      default: "text-default hover:bg-hover",
      ghost: "text-subtle hover:text-default hover:bg-content",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const navLinkClasses = cva({
  base: "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
  variants: {
    variant: {
      default:
        "text-default hover:bg-hover data-[current]:bg-accent data-[current]:text-accent-contrast",
      ghost: "text-subtle hover:text-default hover:bg-content",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface LinkProps extends RouterLinkProps, VariantProps<typeof linkClasses> {}

export function Link({ className, variant, ...props }: LinkProps) {
  return (
    <RouterLink className={linkClasses({ variant, className })} {...props} />
  );
}

interface NavLinkProps
  extends RouterNavLinkProps,
    VariantProps<typeof navLinkClasses> {}

export function NavLink({ className, variant, ...props }: NavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        navLinkClasses({
          variant,
          className: isActive
            ? "bg-accent text-accent-contrast hover:bg-accent-hover"
            : className,
        })
      }
      {...props}
    />
  );
}
