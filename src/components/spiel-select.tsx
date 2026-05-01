"use client";

import { useNavigate } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";
import {
  Button,
  Header,
  ListBox,
  ListBoxItem,
  ListBoxSection,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

interface Match {
  nr: number;
  paarung: string;
  paarungShort: string;
  points: number | null;
}

interface Round {
  nr: number;
  matches: Match[];
}

interface Props {
  rounds: Round[];
  currentNr: number;
}

export function SpielSelect({ rounds, currentNr }: Props) {
  const navigate = useNavigate();

  return (
    <Select
      name="spiel-switch"
      value={currentNr}
      onChange={(nr) => {
        void navigate({ to: "/spiel", search: { nr: Number(nr) } });
      }}
      aria-label="Spiel wechseln"
    >
      <Button className="focus-visible:ring-focus flex items-center gap-2 rounded text-2xl font-semibold tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-offset-2">
        <SelectValue className="group select-value" />
        <ChevronDownIcon size={18} className="text-subtle shrink-0" />
      </Button>
      <Popover className="border-input bg-base w-[28rem] max-w-[calc(100vw-2rem)] rounded-md border shadow-md data-entering:animate-[popover-enter_150ms_ease-out] data-exiting:animate-[popover-exit_100ms_ease-in_forwards]">
        <ListBox className="max-h-96 overflow-auto p-1 outline-none">
          {rounds.map((round) => (
            <ListBoxSection key={round.nr} className="[&:not(:first-child)]:mt-1">
              <Header className="text-subtle px-2 py-1.5 text-xs font-medium tracking-wide uppercase">
                Runde {round.nr}
              </Header>
              {round.matches.map((match) => (
                <ListBoxItem
                  key={match.nr}
                  id={match.nr}
                  textValue={match.paarung}
                  className="data-focused:bg-subtle cursor-default rounded px-4 py-1.5 text-sm transition-colors duration-150 outline-none"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span>
                      <span className="xs:hidden">{match.paarungShort}</span>
                      <span className="xs:inline hidden">{match.paarung}</span>
                    </span>
                    {match.points !== null && (
                      <span className="text-subtle shrink-0 text-xs group-[.select-value]:hidden">
                        {match.points} Pkt
                      </span>
                    )}
                  </div>
                </ListBoxItem>
              ))}
            </ListBoxSection>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}
