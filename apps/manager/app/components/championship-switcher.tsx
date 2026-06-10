import { Button } from "@tipprunde/ui";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { use, useState } from "react";
import { DialogTrigger, ListBox, ListBoxItem, Popover } from "react-aria-components";
import { useNavigate } from "react-router";

import { cn } from "#/lib/utils.ts";

type Championship = { slug: string; name: string };

type ChampionshipSwitcherProps = {
  current: Championship | null;
  championships: Promise<Championship[]>;
};

export function ChampionshipSwitcher({ current, championships }: ChampionshipSwitcherProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const championshipList = use(championships);

  if (!current) return <div className="flex-1" />;

  if (championshipList.length <= 1) {
    return (
      <div className="flex flex-1 items-center px-2">
        <span className="text-muted text-sm">{current.name}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center">
      <DialogTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <Button intent="ghost" className="gap-1.5 px-2 py-1.5">
          {current.name}
          <ChevronsUpDownIcon className="size-3.5 shrink-0" />
        </Button>
        <Popover placement="bottom start">
          <ListBox
            aria-label="Turnier wechseln"
            items={championshipList}
            onAction={(key) => {
              void navigate(`/${key}`);
              setIsOpen(false);
            }}
            className={cn(
              "bg-surface-raised border-subtle min-w-48 rounded-sm border p-1 shadow-lg outline-none",
            )}
          >
            {(championship) => (
              <ListBoxItem
                id={championship.slug}
                textValue={championship.name}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm outline-none",
                  "hover:bg-nav-active",
                  "data-focused:bg-nav-active",
                )}
              >
                <CheckIcon
                  className={cn(
                    "size-3.5 shrink-0",
                    championship.slug !== current.slug && "invisible",
                  )}
                />
                {championship.name}
              </ListBoxItem>
            )}
          </ListBox>
        </Popover>
      </DialogTrigger>
    </div>
  );
}
