import { SearchIcon, XIcon } from "lucide-react";
import { Button, Input, SearchField } from "react-aria-components";

import { cn } from "#/lib/utils.ts";

type FilterInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function FilterInput({ value, onChange, placeholder = "Suchen …" }: FilterInputProps) {
  return (
    <SearchField
      value={value}
      onChange={onChange}
      aria-label="Einträge filtern"
      className="relative flex flex-1 items-center"
    >
      <SearchIcon className="text-muted pointer-events-none absolute left-2.5 size-3.5" />
      <Input
        placeholder={placeholder}
        className={cn(
          "border-subtle bg-surface w-full rounded-sm border py-1.5 pr-8 pl-8 text-sm",
          "placeholder:text-muted outline-none",
          "data-focused:ring-2 data-focused:ring-accent/60",
          "[&::-webkit-search-cancel-button]:hidden",
        )}
      />
      {value && (
        <Button
          aria-label="Filter zurücksetzen"
          className={cn(
            "text-muted absolute right-2 rounded-sm p-0.5 transition-colors",
            "hover:text-app",
            "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
          )}
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
    </SearchField>
  );
}
