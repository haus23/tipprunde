"use client";

import type React from "react";
import { Switch as RACSwitch, type SwitchProps } from "react-aria-components";

interface Props extends Omit<SwitchProps, "className"> {
  children?: React.ReactNode;
}

export function Switch({ children, ...props }: Props) {
  return (
    <RACSwitch
      {...props}
      className={`group cursor-default data-disabled:opacity-50${children ? " grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1" : ""}`}
    >
      <span className="bg-subtle group-data-selected:bg-btn group-data-focus-visible:ring-focus group-data-hovered:shadow-[inset_0_0_0_1px_var(--border-color-input-hovered)] group-data-pressing:scale-[0.97] inline-flex h-6 w-10 shrink-0 rounded-full p-[3px] shadow-[inset_0_0_0_1px_var(--border-color-input)] transition duration-200 ease-out group-data-selected:shadow-none group-data-focus-visible:ring-2 group-data-focus-visible:ring-offset-2 sm:h-5 sm:w-8">
        <span className="bg-switch-thumb size-4.5 rounded-full shadow-sm transition-transform duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] group-data-selected:translate-x-4 sm:size-3.5 sm:group-data-selected:translate-x-3" />
      </span>
      {children && <div>{children}</div>}
    </RACSwitch>
  );
}
