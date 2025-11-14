import {
  Checkbox as _Checkbox,
  composeRenderProps,
  type CheckboxProps,
} from "react-aria-components";
import { cva } from "~/utils/cva";

const checkboxClasses = cva({
  base: "group flex items-center gap-2 text-sm font-semibold text-primary",
});
const checkboxBoxClasses = cva({
  base: [
    "flex h-5 w-5 items-center justify-center rounded-sm",
    "border border-default",
    "group-data-focused:ring-2 group-data-focused:ring-focus",
  ],
});
const checkmarkClasses = cva({
  base: "h-3 w-3 fill-none stroke-current stroke-0 group-data-[selected=true]:stroke-3",
});

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <_Checkbox
      className={composeRenderProps(className, (className, renderProps) =>
        checkboxClasses({ ...renderProps, className }),
      )}
      {...props}
    >
      {(renderProps) => (
        <>
          <div className={checkboxBoxClasses()}>
            <svg
              viewBox="0 0 18 18"
              aria-hidden="true"
              className={checkmarkClasses()}
            >
              <polyline points="1 9 7 14 15 4" />
            </svg>
          </div>
          <span>
            {typeof children === "function" ? children(renderProps) : children}
          </span>
        </>
      )}
    </_Checkbox>
  );
}
