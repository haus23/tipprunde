import { SearchIcon, XIcon } from "lucide-react";
import {
  Button as AriaButton,
  Input as AriaInput,
  SearchField as AriaSearchField,
  type SearchFieldProps,
} from "react-aria-components";

import { composeTailwindRenderProps } from "#/lib/compose.ts";

interface Props extends SearchFieldProps {
  placeholder?: string;
}

export function SearchField({ placeholder = "Suchen …", className, ...props }: Props) {
  return (
    <AriaSearchField
      {...props}
      className={composeTailwindRenderProps(className, "relative flex items-center")}
    >
      {({ isEmpty }) => (
        <>
          <SearchIcon className="text-muted pointer-events-none absolute left-2.5 size-3.5" />
          <AriaInput
            placeholder={placeholder}
            className="border-subtle bg-surface text-app placeholder:text-muted data-focused:ring-accent/60 w-full rounded-sm border py-1.5 pr-8 pl-8 text-sm transition ease-out outline-none data-focused:ring-2 [&::-webkit-search-cancel-button]:hidden"
          />
          {!isEmpty && (
            <AriaButton
              slot="clear"
              aria-label="Suche zurücksetzen"
              className="text-muted data-hovered:bg-nav-active data-hovered:text-app data-focus-visible:ring-accent absolute right-2 flex size-6 items-center justify-center rounded-sm p-0.5 transition ease-out outline-none data-focus-visible:ring-2 data-pressed:scale-[0.97]"
            >
              <XIcon className="size-3.5" />
            </AriaButton>
          )}
        </>
      )}
    </AriaSearchField>
  );
}
