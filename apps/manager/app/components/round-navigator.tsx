import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "react-aria-components";
import { useNavigate } from "react-router";

import { cn } from "#/lib/utils.ts";

type RoundNavigatorProps = {
  currentNr: number;
  totalRounds: number;
  base: string; // absolute base path, e.g. "/turnier-2024/spiele"
};

export function RoundNavigator({ currentNr, totalRounds, base }: RoundNavigatorProps) {
  const navigate = useNavigate();
  const hasPrev = currentNr > 1;
  const hasNext = currentNr < totalRounds;

  return (
    <div className="flex items-center gap-1">
      <Button
        isDisabled={!hasPrev}
        onPress={() => void navigate(`${base}/${currentNr - 1}`)}
        aria-label="Vorherige Runde"
        className={cn(
          "text-muted rounded-sm p-1 transition-colors",
          "hover:bg-nav-active hover:text-app",
          "data-disabled:opacity-40",
          "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
        )}
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <span className="text-muted px-2 text-sm tabular-nums">
        Runde {currentNr} von {totalRounds}
      </span>
      <Button
        isDisabled={!hasNext}
        onPress={() => void navigate(`${base}/${currentNr + 1}`)}
        aria-label="Nächste Runde"
        className={cn(
          "text-muted rounded-sm p-1 transition-colors",
          "hover:bg-nav-active hover:text-app",
          "data-disabled:opacity-40",
          "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
        )}
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
}
