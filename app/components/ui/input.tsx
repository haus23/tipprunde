import { Input as _Input, type InputProps } from "react-aria-components";
import { cva } from "~/utils/cva";

const inputClasses = cva({
  base: ["px-3 py-1.5 border"],
});

export function Input({ className, ...props }: InputProps) {
  return <_Input className={inputClasses({ className })} {...props} />;
}
