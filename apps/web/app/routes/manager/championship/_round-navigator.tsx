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

  /**
   * The icon size gives a 28px button, which is small for a finger. Only grown
   * below sm: on a pointer device 28px is fine, and the row this sits in is the
   * same one on three pages — no reason to make it taller everywhere.
   */
  const hitArea = "p-3 sm:p-1.5";

  return (
    <div className="flex items-center gap-1">
      <Button
        intent="ghost"
        size="icon"
        isDisabled={!hasPrev}
        onPress={() => onNavigate(currentNr - 1)}
        aria-label="Vorherige Runde"
        className={hitArea}
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
        className={hitArea}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
