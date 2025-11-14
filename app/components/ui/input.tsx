import { Input as _Input, type InputProps } from "react-aria-components";
import { cva } from "~/utils/cva";

const inputClasses = cva({
  base: [
    "px-3 py-2 rounded-md",
    "border border-default data-invalid:border-error",
    "bg-raised text-primary",
    "placeholder:text-tertiary",
  ],
});

export function Input({ className, ...props }: InputProps) {
  return <_Input className={inputClasses({ className })} {...props} />;
}
