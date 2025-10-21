import { cva } from "~/utils/cva";

const buttonClasses = cva({
  base: ["px-3 py-1.5 border"],
});

export interface ButtonProps extends React.ComponentProps<"button"> {}

export function Button({ className, ...props }: ButtonProps) {
  return <button className={buttonClasses({ className })} {...props} />;
}
