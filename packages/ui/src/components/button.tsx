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
      // Visually still a 28px square (matches WCAG 2.5.8's 24px minimum with
      // room to spare) — the padding/negative-margin pair only grows the
      // *hit* area, toward Apple/Material's 44px target, without pushing
      // neighbors around: -m-2 (-8px) cancels p-3.5 (+14px) back down to the
      // original p-1.5 (6px) footprint. Where a neighbor sits closer than
      // 16px away, cap the facing side locally (see color-scheme-toggle.tsx,
      // spieler.tsx) rather than shrinking this for everyone.
      icon: "-m-2 p-3.5",
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
