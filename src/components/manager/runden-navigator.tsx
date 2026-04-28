import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface Props {
  rounds: { nr: number }[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

export function RundenNavigator({ rounds, currentIndex, onNavigate }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onNavigate(currentIndex - 1)}
        disabled={currentIndex === 0}
        className="hover:bg-subtle focus-visible:ring-focus rounded-md p-1 outline-none focus-visible:ring-2 disabled:opacity-40"
        aria-label="Vorherige Runde"
      >
        <ChevronLeftIcon size={16} />
      </button>
      <span className="text-sm font-medium">
        Runde {rounds[currentIndex].nr} von {rounds.length}
      </span>
      <button
        onClick={() => onNavigate(currentIndex + 1)}
        disabled={currentIndex === rounds.length - 1}
        className="hover:bg-subtle focus-visible:ring-focus rounded-md p-1 outline-none focus-visible:ring-2 disabled:opacity-40"
        aria-label="Nächste Runde"
      >
        <ChevronRightIcon size={16} />
      </button>
    </div>
  );
}
