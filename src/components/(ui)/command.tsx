"use client";

import { CommandRoot, CommandItem as _CommandItem, CommandInput, CommandList } from "cmdk";
import React, { useCallback } from "react";
import { createContext, use } from "react";

type KeyProp<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

interface CommandProps<T extends object> {
  label: string;
  placeholder?: string;
  items: Array<T>;
  children?: React.ReactNode | ((item: T) => React.ReactNode);
  onSelect: (item: T) => void;
  keyProp: KeyProp<T>;
  filter: (item: T, search: string) => boolean;
}

type CommandContextType = {
  onSelect: (value: string) => void;
};

const CommandContext = createContext<CommandContextType>({ onSelect: () => {} });

export function Command<T extends object>({
  label,
  placeholder,
  items,
  children,
  onSelect,
  keyProp,
  filter,
}: CommandProps<T>) {
  const handleSelect = useCallback(
    (value: string) => {
      const item = items.find((item) => item[keyProp] === value);
      if (typeof item !== "undefined") onSelect(item);
    },
    [items, keyProp, onSelect],
  );

  const handleFilter = useCallback(
    (value: string, search: string) => {
      const item: T | undefined = items.find((item) => item[keyProp] === value);
      if (!item) return 0;

      return filter(item, search) ? 1 : 0;
    },
    [items, keyProp, filter],
  );

  return (
    <CommandContext value={{ onSelect: handleSelect }}>
      <CommandRoot aria-label={label} filter={handleFilter}>
        <div className="border-input border-b px-3 py-2">
          <CommandInput
            autoFocus
            placeholder={placeholder}
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <CommandList className="max-h-72 overflow-y-auto p-1">
          {typeof children === "function" ? items.map((item) => children(item)) : children}
        </CommandList>
      </CommandRoot>
    </CommandContext>
  );
}

export function CommandItem({ children, value }: { children: React.ReactNode; value: string }) {
  const commandContext = use(CommandContext);
  return (
    <_CommandItem
      value={value}
      onSelect={commandContext.onSelect}
      className="data-[selected=true]:bg-subtle flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm outline-none"
    >
      {children}
    </_CommandItem>
  );
}
