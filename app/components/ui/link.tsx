import { 
  Link as RouterLink, 
  NavLink as RouterNavLink, 
  type LinkProps as RouterLinkProps,
  type NavLinkProps as RouterNavLinkProps 
} from "react-router";
import { cva, type VariantProps } from "~/utils/cva";

const linkClasses = cva({
  base: "flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors",
  variants: {
    size: {
      default: "text-sm",
      lg: "text-base",
    },
    variant: {
      default: "text-gray-700 hover:bg-gray-100",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

const navLinkClasses = cva({
  base: "flex items-center space-x-3 px-3 py-2 rounded-md font-medium transition-colors",
  variants: {
    size: {
      default: "text-sm",
      lg: "text-base",
    },
    variant: {
      default: "text-gray-700 hover:bg-gray-100 data-[current]:bg-gray-900 data-[current]:text-white",
      ghost: "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

interface LinkProps extends RouterLinkProps, VariantProps<typeof linkClasses> {}

export function Link({ className, size, variant, ...props }: LinkProps) {
  return (
    <RouterLink
      className={linkClasses({ size, variant, className })}
      {...props}
    />
  );
}

interface NavLinkProps extends RouterNavLinkProps, VariantProps<typeof navLinkClasses> {}

export function NavLink({ className, size, variant, ...props }: NavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        navLinkClasses({
          size,
          variant,
          className: isActive ? "bg-gray-900 text-white hover:bg-gray-800" : className,
        })
      }
      {...props}
    />
  );
}