import { SearchIcon, XIcon } from "lucide-react";

import { cn } from "#/lib/utils.ts";

type FilterInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function FilterInput({ value, onChange, placeholder = "Suchen …" }: FilterInputProps) {
  return (
    <div className="relative mr-4 flex flex-1 items-center">
      <SearchIcon className="text-muted pointer-events-none absolute left-2.5 size-3.5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "border-subtle bg-surface w-full rounded-sm border py-1.5 pr-8 pl-8 text-sm",
          "placeholder:text-muted outline-none",
          "focus-visible:ring-2 focus-visible:ring-accent/60",
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Filter zurücksetzen"
          className={cn(
            "text-muted absolute right-2 rounded-sm p-0.5 transition-colors",
            "hover:text-app",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
          )}
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
