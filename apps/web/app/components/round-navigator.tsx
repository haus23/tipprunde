import { Button } from "@tipprunde/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type RoundNavigatorProps = {
  currentNr: number;
  totalRounds: number;
  onNavigate: (nr: number) => void;
};

export function RoundNavigator({ currentNr, totalRounds, onNavigate }: RoundNavigatorProps) {
  const hasPrev = currentNr > 1;
  const hasNext = currentNr < totalRounds;

  return (
    <div className="flex items-center gap-1">
      <Button
        intent="ghost"
        size="icon"
        isDisabled={!hasPrev}
        onPress={() => onNavigate(currentNr - 1)}
        aria-label="Vorherige Runde"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <span className="text-muted px-2 text-sm tabular-nums">
        Runde {currentNr} von {totalRounds}
      </span>
      <Button
        intent="ghost"
        size="icon"
        isDisabled={!hasNext}
        onPress={() => onNavigate(currentNr + 1)}
        aria-label="Nächste Runde"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
