"use client";

import {
  ComboBox as RACComboBox,
  type ComboBoxProps,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from "react-aria-components";
import { Label } from "@/components/(ui)/text-field.tsx";

interface Item {
  id: string;
  name: string;
}

interface Props extends Omit<ComboBoxProps<Item>, "children"> {
  label?: string;
  items: Item[];
  placeholder?: string;
}

export function ComboBox({ label, items, placeholder, ...props }: Props) {
  return (
    <RACComboBox {...props} items={items} menuTrigger="focus" className="flex flex-col gap-1">
      {label && <Label>{label}</Label>}
      <Input
        placeholder={placeholder}
        className="border-input data-hovered:border-input-hovered focus-visible:ring-focus w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
      />
      <Popover className="border-input bg-base max-h-60 w-[var(--trigger-width)] overflow-y-auto rounded-md border shadow-md">
        <ListBox className="p-1 outline-none">
          {(item) => (
            <ListBoxItem
              id={item.id}
              textValue={item.name}
              className="data-focused:bg-subtle cursor-default rounded px-2 py-1.5 text-sm outline-none"
            >
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </RACComboBox>
  );
}
