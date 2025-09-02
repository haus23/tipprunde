import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from "react-aria-components";
import { cva, type VariantProps } from "~/utils/cva";

const buttonClasses = cva({
  base: "rounded-md font-medium transition-colors",
  variants: {
    variant: {
      default: "bg-accent text-accent-contrast hover:bg-accent-hover active:bg-accent-hover",
      ghost: "text-default hover:bg-hover active:bg-surface",
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
