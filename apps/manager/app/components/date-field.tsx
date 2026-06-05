import { parseDate } from "@internationalized/date";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  CalendarHeading,
  DateInput,
  DatePicker,
  DateSegment,
  Group,
  Label,
  Popover,
} from "react-aria-components";

import { cn } from "#/lib/utils.ts";

type DateFieldProps = {
  name: string;
  label: string;
  defaultValue?: string | null;
};

export function DateField({ name, label, defaultValue }: DateFieldProps) {
  const parsedDefault = defaultValue ? parseDate(defaultValue) : undefined;

  return (
    <DatePicker
      name={name}
      defaultValue={parsedDefault}
      shouldForceLeadingZeros
      className="flex flex-col gap-1.5"
    >
      <Label className="text-sm font-medium">{label}</Label>

      {/* Input group: segmented input + calendar trigger */}
      <Group
        className={cn(
          "border-subtle bg-surface flex items-center rounded-sm border",
          "focus-within:ring-2 focus-within:ring-accent/60",
        )}
      >
        <DateInput className="flex flex-1 items-center px-2.5 py-1.5 text-sm outline-none">
          {(segment) => (
            <DateSegment
              segment={segment}
              className={({ isFocused, isPlaceholder }) =>
                cn(
                  "inline whitespace-nowrap rounded-xs px-0.5 caret-transparent outline-none tabular-nums",
                  "type-literal:px-0 type-literal:text-muted",
                  isPlaceholder && "text-muted",
                  isFocused && "bg-btn text-btn",
                )
              }
            />
          )}
        </DateInput>
        <Button
          className={cn(
            "text-muted border-subtle mr-1 rounded-sm border-l p-1 outline-none transition-colors",
            "hover:bg-nav-active hover:text-app",
          )}
        >
          <CalendarIcon className="size-4" />
        </Button>
      </Group>

      {/* Calendar popup */}
      <Popover className="bg-surface-raised border-subtle rounded-md border p-3 shadow-lg outline-none">
        <Calendar className="w-56">
          <header className="mb-3 flex items-center justify-between">
            <Button
              slot="previous"
              className={cn(
                "text-muted rounded-sm p-1 outline-none transition-colors",
                "hover:bg-nav-active hover:text-app",
              )}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <CalendarHeading className="my-0 text-sm font-semibold" />
            <Button
              slot="next"
              className={cn(
                "text-muted rounded-sm p-1 outline-none transition-colors",
                "hover:bg-nav-active hover:text-app",
              )}
            >
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
                    cn(
                      "flex size-7 m-0.5 cursor-default items-center justify-center rounded-full text-sm outline-none",
                      isOutsideMonth && "opacity-30",
                      isDisabled && "opacity-30",
                      !isSelected && !isDisabled && "hover:bg-nav-active",
                      isFocused && !isSelected && "ring-2 ring-inset ring-accent/60",
                      isSelected && "bg-btn text-btn",
                    )
                  }
                />
              )}
            </CalendarGridBody>
          </CalendarGrid>
        </Calendar>
      </Popover>
    </DatePicker>
  );
}
