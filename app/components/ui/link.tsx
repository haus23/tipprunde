import { 
  Link as RouterLink, 
  NavLink as RouterNavLink, 
  type LinkProps as RouterLinkProps,
  type NavLinkProps as RouterNavLinkProps 
} from "react-router";
import { cva, type VariantProps } from "~/utils/cva";

const linkClasses = cva({
  base: "flex items-center gap-2 p-1 rounded-md text-sm font-medium transition-colors",
  variants: {
    variant: {
      default: "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
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
      default: "text-gray-700 hover:bg-gray-100 data-[current]:bg-gray-900 data-[current]:text-white dark:text-gray-300 dark:hover:bg-gray-800 dark:data-[current]:bg-gray-100 dark:data-[current]:text-gray-900",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface LinkProps extends RouterLinkProps, VariantProps<typeof linkClasses> {}

export function Link({ className, variant, ...props }: LinkProps) {
  return (
    <RouterLink
      className={linkClasses({ variant, className })}
      {...props}
    />
  );
}

interface NavLinkProps extends RouterNavLinkProps, VariantProps<typeof navLinkClasses> {}

export function NavLink({ className, variant, ...props }: NavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        navLinkClasses({
          variant,
          className: isActive ? "bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200" : className,
        })
      }
      {...props}
    />
  );
}