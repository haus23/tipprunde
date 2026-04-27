"use client";

import { Button as RACButton, type ButtonProps } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: "inline-flex cursor-default items-center justify-center rounded-md text-sm font-medium outline-none transition-[transform,background-color,border-color,opacity] duration-150 ease-out focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50 data-pressed:scale-[0.97]",
  variants: {
    variant: {
      primary: "bg-btn text-btn data-hovered:bg-btn-hovered data-pressed:bg-btn-pressed",
      secondary:
        "border border-input data-hovered:border-input-hovered data-hovered:bg-subtle data-pressed:opacity-70",
      plain: "data-hovered:bg-subtle data-pressed:opacity-70",
    },
    size: {
      default: "px-4 py-2",
      icon: "p-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "default",
  },
});

interface Props extends ButtonProps, VariantProps<typeof button> {
  className?: string;
}

export function Button({ variant, size, className, ...props }: Props) {
  return <RACButton {...props} className={button({ variant, size, className })} />;
}
