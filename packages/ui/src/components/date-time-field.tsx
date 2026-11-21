import { now, parseAbsolute } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import { DateInput, DatePicker, DateSegment, Group } from "react-aria-components";

import { cx } from "../lib/cva.ts";
import { Button } from "./button.tsx";
import { CalendarPopover } from "./calendar-popover.tsx";
import { Label } from "./label.tsx";

type DateTimeFieldProps = {
  name: string;
  label: string;
  /** A point in time as an ISO string (`2026-11-21T14:30:00.000Z`). */
  defaultValue?: string | null;
  /** The zone the value is entered and shown in, e.g. "Europe/Berlin". */
  timeZone: string;
  autoFocus?: boolean;
  /** For placement only — the field sizes itself to its segments. */
  className?: string;
};

/**
 * Date and time to the minute, 24-hour, in a fixed time zone — whatever the
 * browser's own zone is. Submits as a zoned string with offset, e.g.
 * `2026-11-21T15:30:00+01:00[Europe/Berlin]`; strip the bracketed zone and
 * `new Date()` reads it as the exact instant.
 */
export function DateTimeField({
  name,
  label,
  defaultValue,
  timeZone,
  autoFocus,
  className,
}: DateTimeFieldProps) {
  const parsedDefault = defaultValue ? parseAbsolute(defaultValue, timeZone) : undefined;

  return (
    <DatePicker
      name={name}
      defaultValue={parsedDefault}
      // Without a value, the placeholder decides the value's type: a zoned
      // date-time, so the first keystroke already lands in `timeZone`.
      placeholderValue={now(timeZone).set({ second: 0, millisecond: 0 })}
      granularity="minute"
      hourCycle={24}
      hideTimeZone
      shouldForceLeadingZeros
      autoFocus={autoFocus}
      className={cx("flex flex-col gap-1.5", className)}
    >
      <Label>{label}</Label>

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
                  // The ", " between date and time is a flex item of its own, and a
                  // flex item drops trailing whitespace — keep it.
                  "data-[type=literal]:px-0 data-[type=literal]:text-muted data-[type=literal]:whitespace-pre",
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
