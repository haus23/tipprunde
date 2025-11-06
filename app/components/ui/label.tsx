import { Label as _Label, type LabelProps } from "react-aria-components";
import { cva } from "~/utils/cva";

const labelClasses = cva({
  base: ["text-sm font-semibold"],
});

export function Label({ className, ...props }: LabelProps) {
  return <_Label className={labelClasses({ className })} {...props} />;
}
