import { CheckIcon, ChevronsUpDownIcon, FoldersIcon, SearchIcon } from "lucide-react";
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
import { useNavigate } from "react-router";

interface SwitchChampionship {
  slug: string;
  name: string;
  /** "/" for the running championship, "/archiv/<slug>" otherwise. */
  href: string;
}

interface Props {
  championships: SwitchChampionship[];
  currentSlug: string;
  /** Positions the trigger relative to a `relative` ancestor — see the two
   * call sites in championship/index.tsx for why. */
  triggerClassName?: string;
}

/** Diacritic-insensitive contains, so "ru" matches "Rückrunde". */
const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

/**
 * Season switcher next to the championship name — mirrors MatchSwitch /
 * PlayerSwitch (chevron-only trigger, Autocomplete popover). Search earns its
 * keep here specifically: the list only has 5 entries today, but two decades
 * of legacy seasons are still being imported (see docs/decisions/02-hosting-railway.md).
 *
 * Lives on the shared championship overview (championship/index.tsx), so it
 * appears once for the running season and once per archived one — the same
 * file, per docs/decisions/05-championship-scope.md. This is the only way in and out
 * of the Archiv; there is deliberately no header nav entry for it.
 */
export function ChampionshipSwitcher({ championships, currentSlug, triggerClassName }: Props) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        aria-label="Turnier wechseln"
        className={`text-subtle data-hovered:bg-nav-active data-hovered:text-app data-focus-visible:ring-accent flex size-7 items-center justify-center rounded-sm transition ease-out outline-none data-focus-visible:ring-2 data-pressed:scale-[0.97] ${triggerClassName ?? ""}`}
      >
        <ChevronsUpDownIcon className="size-4" />
      </Button>
      <Popover
        placement="bottom"
        offset={6}
        className="border-subtle bg-surface-raised shadow-popover flex w-64 origin-top flex-col overflow-hidden rounded-md border transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0"
      >
        <Dialog aria-label="Turnier suchen" className="flex min-h-0 flex-1 flex-col outline-none">
          <Autocomplete
            filter={(textValue, inputValue) => normalize(textValue).includes(normalize(inputValue))}
          >
            <div className="border-subtle shrink-0 border-b p-2">
              <SearchField
                aria-label="Turnier suchen"
                autoFocus
                className="relative flex items-center"
              >
                <SearchIcon className="text-muted pointer-events-none absolute left-2.5 size-3.5" />
                <Input
                  placeholder="Turnier suchen …"
                  className="border-subtle bg-surface text-app placeholder:text-muted data-focused:ring-accent/60 w-full rounded-sm border py-1.5 pr-2 pl-8 text-sm transition ease-out outline-none data-focused:ring-2 [&::-webkit-search-cancel-button]:hidden"
                />
              </SearchField>
            </div>
            <Menu
              className="min-h-0 flex-1 overflow-auto p-1 outline-none"
              onAction={(key) => {
                setIsOpen(false);
                if (key === "__archiv") {
                  void navigate("/archiv");
                  return;
                }
                const target = championships.find((c) => c.slug === key);
                if (target) void navigate(target.href);
              }}
            >
              {championships.map((c) => (
                <MenuItem
                  key={c.slug}
                  id={c.slug}
                  textValue={c.name}
                  className="text-app data-focused:bg-nav-active relative flex cursor-default items-center rounded-sm py-1.5 pr-2.5 pl-8 text-sm outline-none select-none"
                >
                  {c.slug === currentSlug && (
                    <CheckIcon className="text-accent absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                  )}
                  {c.name}
                </MenuItem>
              ))}
              <MenuItem
                id="__archiv"
                textValue="Alle Turniere"
                className="text-accent data-focused:bg-nav-active border-subtle mt-1 flex cursor-default items-center gap-2 rounded-sm border-t px-2.5 py-1.5 pt-2.5 text-sm outline-none select-none"
              >
                <FoldersIcon className="size-3.5 shrink-0" />
                Alle Turniere
              </MenuItem>
            </Menu>
          </Autocomplete>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
}
