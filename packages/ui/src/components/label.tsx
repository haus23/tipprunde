import { Label as AriaLabel, type LabelProps } from "react-aria-components";

import { cx } from "#/lib/cva.ts";

export function Label({ className, ...props }: LabelProps) {
  return <AriaLabel className={cx("text-app text-sm font-medium", className)} {...props} />;
}
