import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "react-aria-components";
import { useNavigate } from "react-router";

import { cn } from "#/lib/utils.ts";

type RoundNavigatorProps = {
  rounds: { nr: number }[];
  currentNr: number;
  base: string; // absolute base path, e.g. "/turnier-2024/spiele"
};

export function RoundNavigator({ rounds, currentNr, base }: RoundNavigatorProps) {
  const navigate = useNavigate();
  const currentIndex = rounds.findIndex((r) => r.nr === currentNr);
  const prevRound = currentIndex > 0 ? rounds[currentIndex - 1] : null;
  const nextRound = currentIndex < rounds.length - 1 ? rounds[currentIndex + 1] : null;

  return (
    <div className="flex items-center gap-1">
      <Button
        isDisabled={!prevRound}
        onPress={() => prevRound && void navigate(`${base}/${prevRound.nr}`)}
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
        Runde {currentIndex + 1} von {rounds.length}
      </span>
      <Button
        isDisabled={!nextRound}
        onPress={() => nextRound && void navigate(`${base}/${nextRound.nr}`)}
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
