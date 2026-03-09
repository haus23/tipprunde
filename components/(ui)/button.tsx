"use client";

import { Button as RACButton, type ButtonProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex cursor-default items-center justify-center rounded-md px-4 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50",
  variants: {
    variant: {
      primary: "bg-btn text-btn data-hovered:bg-btn-hovered data-pressed:bg-btn-pressed",
      secondary: "border border-input data-hovered:border-input-hovered data-pressed:opacity-70",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface Props extends ButtonProps, VariantProps<typeof button> {}

export function Button({ variant, className, ...props }: Props) {
  return <RACButton {...props} className={button({ variant, className: className as string })} />;
}
