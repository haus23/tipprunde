"use client";

import type React from "react";
import { Checkbox as RACCheckbox, type CheckboxProps } from "react-aria-components";

interface Props extends Omit<CheckboxProps, "children" | "className"> {
  children?: React.ReactNode;
}

export function Checkbox({ children, ...props }: Props) {
  return (
    <RACCheckbox {...props} className="group flex cursor-default items-center gap-2 text-sm">
      <span className="border-input group-data-selected:bg-btn group-data-selected:border-btn group-data-selected:text-btn group-data-focus-visible:ring-focus flex size-4 shrink-0 items-center justify-center rounded border transition-colors duration-150 ease-out group-data-focus-visible:ring-2">
        <svg
          viewBox="0 0 10 10"
          className="size-3 opacity-0 transition-opacity duration-100 ease-out group-data-selected:opacity-100"
          fill="none"
          strokeWidth={2}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1.5 5l2.5 2.5 4.5-4.5" />
        </svg>
      </span>
      {children}
    </RACCheckbox>
  );
}
