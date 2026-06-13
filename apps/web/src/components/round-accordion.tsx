import { ChevronDownIcon } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  /** Rendered left of the chevron in the summary row (round stats). */
  meta?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Flat, card-less round accordion shared by the Spieler and Spiele views.
 * Native `<details name="runden">` gives exclusive open + the CSS fold animation
 * in app.css. `children` is the panel body (a match table).
 */
export function RoundAccordion({ title, meta, defaultOpen, children }: Props) {
  return (
    <details
      name="runden"
      open={defaultOpen}
      className="group border-subtle border-b last:border-b-0"
    >
      <summary className="focus-visible:ring-accent hover:bg-surface-raised xs:px-3 flex cursor-pointer list-none items-center justify-between px-2 py-3 transition-colors outline-none select-none focus-visible:ring-2 focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-medium">{title}</span>
        <span className="flex items-center gap-3">
          {meta}
          <ChevronDownIcon className="text-subtle size-3.5 transition-transform duration-200 group-open:rotate-180" />
        </span>
      </summary>
      <div className="xs:px-3 px-2 pb-3">{children}</div>
    </details>
  );
}
