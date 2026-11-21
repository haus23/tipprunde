import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  Popover,
} from "react-aria-components";

import { cx } from "../lib/cva.ts";
import { Button } from "./button.tsx";

/** The calendar popup shared by DateField and DateTimeField. Not exported
 *  from the package: it only works inside a React Aria DatePicker. */
export function CalendarPopover() {
  return (
    <Popover className="bg-surface-raised border-subtle rounded-md border p-3 shadow-lg outline-none">
      <Calendar className="w-56">
        <header className="mb-3 flex items-center justify-between">
          <Button slot="previous" intent="ghost" size="icon" className="p-1">
            <ChevronLeftIcon className="size-4" />
          </Button>
          <CalendarHeading className="my-0 text-sm font-semibold" />
          <Button slot="next" intent="ghost" size="icon" className="p-1">
            <ChevronRightIcon className="size-4" />
          </Button>
        </header>

        <CalendarGrid className="w-full">
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="text-muted pb-2 text-xs font-medium">
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => (
              <CalendarCell
                date={date}
                className={({ isSelected, isFocused, isDisabled, isOutsideMonth }) =>
                  cx(
                    "flex size-7 m-0.5 cursor-default items-center justify-center rounded-full text-sm outline-none",
                    isOutsideMonth && "invisible pointer-events-none",
                    isDisabled && "opacity-30 pointer-events-none",
                    !isSelected && !isDisabled && "hover:bg-nav-active",
                    isFocused && !isSelected && "ring-2 ring-inset ring-accent/60",
                    isSelected && "bg-accent text-accent-fg",
                  )
                }
              />
            )}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    </Popover>
  );
}
