import { cva } from "~/utils/cva";

const labelClasses = cva({
  base: ["text-sm font-semibold"],
});

export interface LabelProps extends React.ComponentProps<"label"> { }

export function Label({ className, ...props }: LabelProps) {
  return <label className={labelClasses({ className })} {...props} />;
}
