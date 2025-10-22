import { Button as _Button, type ButtonProps } from "react-aria-components";
import { cva } from "~/utils/cva";

const buttonClasses = cva({
  base: ["px-3 py-1.5 border"],
});

export function Button({ className, ...props }: ButtonProps) {
  return <_Button className={buttonClasses({ className })} {...props} />;
}
