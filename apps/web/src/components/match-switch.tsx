import { useNavigate } from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import { useState } from "react";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogTrigger,
  Header,
  Input,
  Menu,
  MenuItem,
  MenuSection,
  Popover,
  SearchField,
} from "react-aria-components";

interface SwitchMatch {
  nr: number;
  paarung: string;
  paarungShort: string;
  points: number | null;
}

interface SwitchRound {
  nr: number;
  matches: SwitchMatch[];
}

interface Props {
  rounds: SwitchRound[];
  currentNr: number;
}

/** Diacritic-insensitive contains, so "mu" matches "Mönchengladbach". */
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/**
 * Match switcher next to the pairing — a command-palette popover grouped by round
 * (MenuSection). Each item shows the match's total points, which are excluded
 * from the search (the item's textValue is only the pairing). Mirrors PlayerSwitch.
 */
export function MatchSwitch({ rounds, currentNr }: Props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label="Spiel wechseln"
        className="text-subtle data-hovered:bg-nav-active data-hovered:text-app data-focus-visible:ring-accent flex size-7 items-center justify-center rounded-sm transition ease-out outline-none data-focus-visible:ring-2 data-pressed:scale-[0.97]"
      >
        <ChevronsUpDownIcon className="size-4" />
      </Button>
      <Popover
        placement="bottom"
        offset={6}
        className="border-subtle bg-surface-raised shadow-popover flex w-[min(30rem,90vw)] origin-top flex-col overflow-hidden rounded-md border transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Dialog aria-label="Spiel suchen" className="flex min-h-0 flex-1 flex-col outline-none">
          <Autocomplete
            filter={(textValue, inputValue) => normalize(textValue).includes(normalize(inputValue))}
          >
            <div className="border-subtle shrink-0 border-b p-2">
              <SearchField
                aria-label="Spiel suchen"
                autoFocus
                className="relative flex items-center"
              >
                <SearchIcon className="text-muted pointer-events-none absolute left-2.5 size-3.5" />
                <Input
                  placeholder="Spiel suchen …"
                  className="border-subtle bg-surface text-app placeholder:text-muted data-focused:ring-accent/60 w-full rounded-sm border py-1.5 pr-2 pl-8 text-sm transition ease-out outline-none data-focused:ring-2 [&::-webkit-search-cancel-button]:hidden"
                />
              </SearchField>
            </div>
            <Menu
              className="min-h-0 flex-1 overflow-auto px-1 pb-1 outline-none"
              onAction={(key) => {
                setIsOpen(false);
                void navigate({ to: "/spiele/$nr", params: { nr: String(key) } });
              }}
            >
              {rounds.map((r) => (
                <MenuSection key={r.nr} id={`round-${r.nr}`}>
                  <Header className="text-muted bg-surface-raised sticky top-0 z-10 px-2.5 pt-2 pb-1 text-[0.6875rem] font-bold tracking-wider uppercase">
                    Runde {r.nr}
                  </Header>
                  {r.matches.map((m) => (
                    <MenuItem
                      key={m.nr}
                      id={m.nr}
                      textValue={m.paarung}
                      className="text-app data-focused:bg-nav-active relative flex cursor-default items-center gap-3 rounded-sm py-1.5 pr-2.5 pl-8 text-sm outline-none select-none"
                    >
                      {m.nr === currentNr && (
                        <CheckIcon className="text-accent absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                      )}
                      <span className="flex-1 truncate">
                        <span className="xs:hidden">{m.paarungShort}</span>
                        <span className="xs:inline hidden">{m.paarung}</span>
                      </span>
                      {m.points !== null && (
                        <span className="text-subtle shrink-0 text-xs">{m.points} Pkt</span>
                      )}
                    </MenuItem>
                  ))}
                </MenuSection>
              ))}
            </Menu>
          </Autocomplete>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
