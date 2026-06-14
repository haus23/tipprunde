import { useNavigate } from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTrigger,
  Input,
  Menu,
  MenuItem,
  Popover,
  SearchField,
} from "react-aria-components";

interface Player {
  slug: string;
  name: string;
}

interface Props {
  players: Player[];
  currentSlug: string;
}

/** Diacritic-insensitive contains, so "mu" matches "Müller". */
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/**
 * Vercel-style player switcher: a chevron-only button next to the player name
 * opens a command-palette popover (search field + filtered list). Self-contained
 * so the internals can later be swapped for a `cmdk`-based palette.
 */
export function PlayerSwitch({ players, currentSlug }: Props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label="Spieler wechseln"
        className="text-subtle data-hovered:bg-nav-active data-hovered:text-app data-focus-visible:ring-accent flex size-7 items-center justify-center rounded-sm transition ease-out outline-none data-focus-visible:ring-2 data-pressed:scale-[0.97]"
      >
        <ChevronsUpDownIcon className="size-4" />
      </Button>
      <Popover
        placement="bottom start"
        offset={6}
        className="border-subtle bg-surface-raised shadow-popover w-64 origin-top rounded-md border transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Dialog aria-label="Spieler suchen" className="outline-none">
          <Autocomplete
            filter={(textValue, inputValue) => normalize(textValue).includes(normalize(inputValue))}
          >
            <div className="border-subtle border-b p-2">
              <SearchField
                aria-label="Spieler suchen"
                autoFocus
                className="relative flex items-center"
              >
                <SearchIcon className="text-muted pointer-events-none absolute left-2.5 size-3.5" />
                <Input
                  placeholder="Spieler suchen …"
                  className="border-subtle bg-surface text-app placeholder:text-muted data-focused:ring-accent/60 w-full rounded-sm border py-1.5 pr-2 pl-8 text-sm transition ease-out outline-none data-focused:ring-2 [&::-webkit-search-cancel-button]:hidden"
                />
              </SearchField>
            </div>
            <Menu
              className="max-h-64 overflow-auto p-1 outline-none"
              onAction={(key) => {
                setIsOpen(false);
                void navigate({ to: "/spieler/{-$slug}", params: { slug: String(key) } });
              }}
            >
              {players.map((p) => (
                <MenuItem
                  key={p.slug}
                  id={p.slug}
                  textValue={p.name}
                  className="text-app data-focused:bg-nav-active relative flex cursor-default items-center rounded-sm py-1.5 pr-2.5 pl-8 text-sm outline-none select-none"
                >
                  {p.slug === currentSlug && (
                    <CheckIcon className="text-accent absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                  )}
                  {p.name}
                </MenuItem>
              ))}
            </Menu>
          </Autocomplete>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
