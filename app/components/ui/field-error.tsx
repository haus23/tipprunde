import {
  FieldError as _FieldError,
  type FieldErrorProps,
  composeRenderProps,
} from "react-aria-components";
import { cva } from "~/utils/cva";

const fieldErrorClasses = cva({
  base: "text-sm italic text-secondary",
});

export function FieldError({ className, ...props }: FieldErrorProps) {
  return (
    <_FieldError
      className={composeRenderProps(className, (className, renderProps) =>
        fieldErrorClasses({ ...renderProps, className }),
      )}
      {...props}
    />
  );
}
