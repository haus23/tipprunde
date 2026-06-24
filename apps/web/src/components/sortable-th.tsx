import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from "lucide-react";

export type SortCol = "name" | "tip" | "points";
export type SortDir = "asc" | "desc";

export function SortableTh({
  col,
  label,
  align,
  sortCol,
  sortDir,
  onSort,
}: {
  col: SortCol;
  label: string;
  align: "left" | "center";
  sortCol: SortCol | null;
  sortDir: SortDir;
  onSort: (col: SortCol) => void;
}) {
  const active = sortCol === col;
  const Icon = !active ? ArrowUpDownIcon : sortDir === "asc" ? ArrowUpIcon : ArrowDownIcon;
  return (
    <th
      aria-sort={active ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
      className={`xs:px-3 px-2 pt-2 pb-3 font-medium ${align === "center" ? "w-px text-center" : ""}`}
    >
      <button
        type="button"
        onClick={() => onSort(col)}
        className={`hover:text-app focus-visible:ring-accent inline-flex items-center gap-1 rounded-sm transition-colors outline-none focus-visible:ring-2 ${active ? "text-app" : ""}`}
      >
        {label}
        <Icon className={active ? "text-accent size-3" : "text-muted/50 size-3"} />
      </button>
    </th>
  );
}
