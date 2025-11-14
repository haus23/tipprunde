import {
  Button as _Button,
  type ButtonProps as _ButtonProps,
} from "react-aria-components";
import { cva, type VariantProps } from "~/utils/cva";

const buttonClasses = cva({
  base: [
    "flex items-center",
    "data-disabled:opacity-50",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
  ],
  variants: {
    variant: {
      primary: [
        "px-4 py-2 rounded-md",
        "bg-accent hover:bg-accent-hover text-on-accent",
      ],
      secondary: [
        "px-4 py-2 rounded-md",
        "border border-default bg-raised hover:bg-overlay text-primary",
      ],
      ghost: ["p-1 rounded-md"],
      plain: "",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
});

export interface ButtonProps
  extends _ButtonProps,
    VariantProps<typeof buttonClasses> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <_Button className={buttonClasses({ className, variant })} {...props} />
  );
}
