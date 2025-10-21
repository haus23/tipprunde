import { cva } from "~/utils/cva";

const textFieldClasses = cva({
  base: ["flex flex-col gap-1"],
});

export interface TextFieldProps extends React.ComponentProps<"div"> {}

export function TextField({ className, ...props }: TextFieldProps) {
  return <div className={textFieldClasses({ className })} {...props} />;
}
