import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { cva, type VariantProps } from "~/utils/cva";

const buttonClasses = cva({
  base: "rounded-md font-medium transition-colors",
  variants: {
    variant: {
      default: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:active:bg-gray-300",
      ghost: "text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:active:bg-gray-700",
    },
    size: {
      default: "px-3 py-2",
      sm: "p-2",
      lg: "px-4 py-3",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

interface ButtonProps
  extends AriaButtonProps,
    VariantProps<typeof buttonClasses> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <AriaButton
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
}
