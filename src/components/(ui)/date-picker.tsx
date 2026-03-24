"use client";

import { parseDate } from "@internationalized/date";
import { CalendarIcon } from "lucide-react";
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  DateInput,
  DatePicker as RACDatePicker,
  DateSegment,
  Dialog,
  Group,
  Heading,
  Popover,
} from "react-aria-components";
import { Label } from "@/components/(ui)/text-field.tsx";

interface Props {
  label?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  className?: string;
}

export function DatePicker({ label, value, onChange, className }: Props) {
  const dateValue = value ? parseDate(value) : null;

  return (
    <RACDatePicker
      value={dateValue}
      onChange={(v) => onChange?.(v?.toString() ?? null)}
      className={`flex flex-col gap-1 ${className ?? ""}`}
    >
      {label && <Label>{label}</Label>}
      <Group className="border-input data-hovered:border-input-hovered focus-within:ring-focus flex items-center rounded-md border bg-transparent px-3 py-2 text-sm focus-within:ring-2">
        <DateInput className="flex flex-1 items-center gap-px">
          {(segment) => (
            <DateSegment
              segment={segment}
              className="rounded px-0.5 outline-none data-placeholder:text-subtle data-focused:bg-accent data-focused:text-accent-foreground"
            />
          )}
        </DateInput>
        <Button className="text-subtle data-hovered:text-base ml-2 outline-none">
          <CalendarIcon size={14} />
        </Button>
      </Group>
      <Popover className="border-input bg-base rounded-md border shadow-md">
        <Dialog className="p-3 outline-none">
          <Calendar className="flex flex-col gap-3">
            <header className="flex items-center justify-between gap-2">
              <Button
                slot="previous"
                className="border-input data-hovered:bg-subtle rounded border px-2 py-1 text-sm outline-none"
              >
                ‹
              </Button>
              <Heading className="text-sm font-medium" />
              <Button
                slot="next"
                className="border-input data-hovered:bg-subtle rounded border px-2 py-1 text-sm outline-none"
              >
                ›
              </Button>
            </header>
            <CalendarGrid>
              <CalendarGridHeader>
                {(day) => (
                  <CalendarHeaderCell className="text-subtle pb-1 text-xs font-normal">
                    {day}
                  </CalendarHeaderCell>
                )}
              </CalendarGridHeader>
              <CalendarGridBody>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className="flex size-8 cursor-default items-center justify-center rounded text-sm outline-none data-outside-month:text-subtle data-selected:bg-accent data-selected:text-accent-foreground data-hovered:bg-subtle data-focus-visible:ring-2 data-focus-visible:ring-focus"
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
          </Calendar>
        </Dialog>
      </Popover>
    </RACDatePicker>
  );
}
