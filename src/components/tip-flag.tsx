"use client";

import { Button, Tooltip, TooltipTrigger } from "react-aria-components";

interface Props {
  label: string;
}

export function TipFlag({ label }: Props) {
  return (
    <TooltipTrigger delay={300}>
      <Button className="text-accent focus-visible:ring-focus xs:right-1 absolute top-1/2 -right-1.25 -translate-y-1/2 cursor-default rounded outline-none focus-visible:ring-1">
        ★
      </Button>
      <Tooltip
        placement="top"
        className="bg-inverted text-inverted rounded px-2 py-1 text-xs data-entering:animate-[tooltip-enter_150ms_ease-out] data-exiting:animate-[tooltip-exit_100ms_ease-in_forwards]"
      >
        {label}
      </Tooltip>
    </TooltipTrigger>
  );
}
