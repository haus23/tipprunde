import type { ReactNode } from "react";
import { Switch as RACSwitch } from "react-aria-components";
import type { SwitchProps } from "react-aria-components";

interface Props extends Omit<SwitchProps, "children"> {
  children?: ReactNode;
}

export function Switch({ children, ...props }: Props) {
  return (
    <RACSwitch
      {...props}
      className="flex cursor-pointer items-center gap-3 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
    >
      {({ isSelected }) => (
        <>
          <div
            className={`flex h-6 w-11 shrink-0 items-center rounded-full px-0.5 transition-colors duration-200 ${isSelected ? "bg-btn" : "bg-subtle"}`}
          >
            <div
              className={`size-5 rounded-full bg-switch-thumb shadow transition-transform duration-200 ${isSelected ? "translate-x-full" : "translate-x-0"}`}
            />
          </div>
          {children}
        </>
      )}
    </RACSwitch>
  );
}
