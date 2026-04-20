"use client";

import { ChevronDownIcon } from "lucide-react";
import {
  Button,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  Popover,
  Select as RACSelect,
  type SelectProps,
  SelectValue,
} from "react-aria-components";
import { Label } from "./text-field";

interface Props<T extends object> extends SelectProps<T> {
  label?: string;
}

export function Select<T extends object>({ label, children, ...props }: Props<T>) {
  return (
    <RACSelect {...props} className="flex w-full flex-col gap-1">
      {label && <Label>{label}</Label>}
      <Button className="border-input data-hovered:border-input-hovered focus-visible:ring-focus data-invalid:border-error flex w-full items-center justify-between rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2">
        <SelectValue />
        <ChevronDownIcon size={14} className="text-subtle shrink-0" />
      </Button>
      <Popover className="border-input bg-base w-[var(--trigger-width)] rounded-md border shadow-md">
        <ListBox className="p-1 outline-none">{children}</ListBox>
      </Popover>
    </RACSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return (
    <ListBoxItem
      {...props}
      className="data-focused:bg-subtle cursor-default rounded px-2 py-1.5 text-sm outline-none"
    />
  );
}
