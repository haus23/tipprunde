import {
  Button as _Button,
  type ButtonProps as _ButtonProps,
} from "react-aria-components";
import { cva, VariantProps } from "~/utils/cva";

const buttonClasses = cva({
  base: [""],
  variants: {
    variant: {
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
