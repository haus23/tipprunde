import {
  Checkbox as _Checkbox,
  composeRenderProps,
  type CheckboxProps,
} from "react-aria-components";
import { cva } from "~/utils/cva";

// TODO: focus styling
// Currently tweaked by exluding Checkbox from tab order and setting the
// tabindex at the checkmark box

const checkboxClasses = cva({
  base: "group flex items-center gap-2 text-sm font-semibold",
});
const checkmarkClasses = cva({
  base: "h-3 w-3 fill-none stroke-current stroke-0 group-data-[selected=true]:stroke-3",
});

export function Checkbox({ className, children, ...props }: CheckboxProps) {
  return (
    <_Checkbox
      excludeFromTabOrder
      className={composeRenderProps(className, (className, renderProps) =>
        checkboxClasses({ ...renderProps, className }),
      )}
      {...props}
    >
      {(renderProps) => (
        <>
          <div
            tabIndex={0}
            className="flex h-5 w-5 items-center justify-center border"
          >
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
