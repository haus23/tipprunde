import { FieldError as AriaFieldError, type FieldErrorProps } from "react-aria-components";

import { composeTailwindRenderProps } from "#/lib/compose.ts";

export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <AriaFieldError
      className={composeTailwindRenderProps(className, "text-error text-xs")}
      {...props}
    />
  );
}
