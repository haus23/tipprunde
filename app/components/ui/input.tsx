import { cva } from "~/utils/cva";

const inputClasses = cva({
  base: ["px-3 py-1.5 border"],
});

export interface InputProps extends React.ComponentProps<"input"> {}

export function Input({ className, ...props }: InputProps) {
  return <input className={inputClasses({ className })} {...props} />;
}
