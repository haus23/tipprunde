"use client";

import {
  ComboBox as RACComboBox,
  type ComboBoxProps,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";

import { Label } from "./text-field";

interface Item {
  id: string;
  name: string;
}

interface Props extends Omit<ComboBoxProps<Item>, "children"> {
  label?: string;
  placeholder?: string;
  items: Item[];
}

export function ComboBox({ label, placeholder, items, ...props }: Props) {
  return (
    <RACComboBox {...props} menuTrigger="focus" className="flex flex-col gap-1">
      {label && <Label>{label}</Label>}
      <Input
        placeholder={placeholder}
        className="border-input data-hovered:border-input-hovered focus-visible:ring-focus w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
      />
      <Popover className="border-input bg-base w-(--trigger-width) rounded-md border shadow-md data-entering:animate-[popover-enter_150ms_ease-out] data-exiting:animate-[popover-exit_100ms_ease-in_forwards]">
        <ListBox items={items} className="max-h-60 overflow-y-auto p-1 outline-none">
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.name}
              className="data-focused:bg-subtle cursor-default rounded px-2 py-1.5 text-sm transition-colors duration-150 outline-none"
            >
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RACComboBox>
  );
}
