import {
  Switch as RACSwitch,
  type SwitchProps as RACSwitchProps,
} from "react-aria-components";
import { cva } from "~/utils/cva";

const switchClasses = cva({
  base: ["group inline-flex items-center gap-2", "focus-visible:outline-none"],
});

const trackClasses = cva({
  base: [
    "h-6 w-11 rounded-full border-2 border-default",
    "bg-default transition-colors",
    "group-data-selected:bg-accent",
    "group-focus-visible:ring-2 group-focus-visible:ring-focus",
  ],
});

const thumbClasses = cva({
  base: [
    "h-5 w-5 rounded-full bg-emphasis/20 shadow-sm transition-transform",
    "group-data-selected:bg-raised group-data-selected:translate-x-5",
  ],
});

export interface SwitchProps extends RACSwitchProps {}

export function Switch({ className, children, ...props }: SwitchProps) {
  return (
    <RACSwitch className={switchClasses({ className })} {...props}>
      {(renderProps) => (
        <>
          <div className={trackClasses()}>
            <div className={thumbClasses()} />
          </div>
          {typeof children === "function" ? children(renderProps) : children}
        </>
      )}
    </RACSwitch>
  );
}
