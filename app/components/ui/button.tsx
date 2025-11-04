import {
  Button as _Button,
  type ButtonProps as _ButtonProps,
} from "react-aria-components";
import { cva, type VariantProps } from "~/utils/cva";

const buttonClasses = cva({
  base: ["data-disabled:opacity-50"],
  variants: {
    variant: {
      primary: "px-3 py-1.5 border",
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
