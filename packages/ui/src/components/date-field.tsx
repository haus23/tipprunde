import { parseDate } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import { DateInput, DatePicker, DateSegment, Group } from "react-aria-components";

import { cx } from "../lib/cva.ts";
import { Button } from "./button.tsx";
import { CalendarPopover } from "./calendar-popover.tsx";
import { Label } from "./label.tsx";

type DateFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
  /** For placement only — the field sizes itself to its segments. */
  className?: string;
};

export function DateField({ name, label, defaultValue, className }: DateFieldProps) {
  const parsedDefault = defaultValue ? parseDate(defaultValue) : undefined;

  return (
    <DatePicker
      name={name}
      defaultValue={parsedDefault}
      shouldForceLeadingZeros
      className={cx("flex flex-col gap-1.5", className)}
    >
      <Label>{label}</Label>

      {/* Input group: segmented input + calendar trigger */}
      <Group
        className={cx(
          "border-subtle bg-surface flex items-center rounded-sm border",
          "focus-within:ring-2 focus-within:ring-accent/60",
        )}
      >
        <DateInput className="flex flex-1 items-center px-2.5 py-1.5 text-sm outline-none">
          {(segment) => (
            <DateSegment
              segment={segment}
              className={({ isFocused, isPlaceholder }) =>
                cx(
                  "inline whitespace-nowrap rounded-xs caret-transparent outline-none tabular-nums",
                  "data-[type=literal]:px-0 data-[type=literal]:text-muted",
                  isPlaceholder && "text-muted",
                  isFocused && "bg-accent text-accent-fg",
                )
              }
            />
          )}
        </DateInput>
        <Button intent="ghost" size="icon" className="border-subtle mr-1 border-l p-1">
          <CalendarIcon className="size-4" />
        </Button>
      </Group>

      <CalendarPopover />
    </DatePicker>
  );
}
