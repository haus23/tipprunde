import { type VariantProps } from "cva";
import { Button as RACButton, type ButtonProps } from "react-aria-components";

import { cva } from "#/lib/cva.ts";

const buttonClasses = cva({
  base: [
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-sm whitespace-nowrap",
    "transition-colors outline-none",
    "data-focused:ring-2 data-focused:ring-accent",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  variants: {
    intent: {
      primary: "bg-accent text-accent-fg font-medium hover:bg-accent-hover",
      secondary: "border border-subtle hover:bg-nav-active",
      ghost: "text-muted hover:bg-nav-active hover:text-app",
    },
    size: {
      md: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-sm",
      icon: "p-1.5",
    },
  },
  defaultVariants: {
    intent: "primary",
    size: "md",
  },
});

interface Props extends ButtonProps, VariantProps<typeof buttonClasses> {}

export function Button({ className, intent, size, ...props }: Props) {
  return <RACButton className={buttonClasses({ intent, size, className })} {...props} />;
}
