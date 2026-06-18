import { type VariantProps } from "cva";
import { Button as AriaButton, type ButtonProps } from "react-aria-components";

import { cva } from "#/lib/cva.ts";

const buttonClasses = cva({
  base: [
    "inline-flex items-center justify-center gap-2 rounded-sm whitespace-nowrap",
    "transition-[background-color,transform,opacity] ease-out outline-none",
    "data-focus-visible:ring-2 data-focus-visible:ring-accent",
    "data-pressed:scale-[0.97]",
    "disabled:opacity-50",
  ],
  variants: {
    intent: {
      primary: "bg-accent text-accent-fg font-medium data-hovered:bg-accent-hover",
      secondary: "border border-subtle data-hovered:bg-nav-active",
      ghost: "text-muted data-hovered:bg-nav-active data-hovered:text-app",
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
  return <AriaButton className={buttonClasses({ intent, size, className })} {...props} />;
}
