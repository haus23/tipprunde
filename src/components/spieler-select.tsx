"use client";

import { useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from "react-aria-components";

interface Player {
  slug: string;
  name: string;
}

interface Props {
  players: Player[];
  currentSlug: string;
}

export function SpielerSelect({ players, currentSlug }: Props) {
  const navigate = useNavigate();

  return (
    <Select
      value={currentSlug}
      onChange={(slug) => {
        void navigate({ to: "/spieler", search: { name: String(slug) } });
      }}
      aria-label="Spieler wechseln"
    >
      <Button className="focus-visible:ring-focus flex items-center gap-2 rounded text-2xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
        <SelectValue />
        <ChevronDownIcon size={18} className="text-subtle shrink-0" />
      </Button>
      <Popover className="border-input bg-base w-52 rounded-md border shadow-md data-entering:animate-[popover-enter_150ms_ease-out] data-exiting:animate-[popover-exit_100ms_ease-in_forwards]">
        <ListBox className="p-1 outline-none">
          {players.map((p) => (
            <ListBoxItem
              key={p.slug}
              id={p.slug}
              textValue={p.name}
              className="data-focused:bg-subtle cursor-default rounded px-2 py-1.5 text-sm transition-colors duration-150 outline-none"
            >
              {p.name}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}
