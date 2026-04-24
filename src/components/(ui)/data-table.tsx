"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { ReactNode } from "react";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
  }
}
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";

import { SearchField, Input } from "#/components/(ui)/text-field.tsx";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  withFilter?: boolean;
  filterPlaceholder?: string;
  filter?: string;
  onFilterChange?: (value: string) => void;
  toolbar?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  withFilter = false,
  filterPlaceholder = "Suchen …",
  filter: controlledFilter,
  onFilterChange,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const isControlled = controlledFilter !== undefined;

  const [internalFilter, setInternalFilter] = useState("");
  const globalFilter = isControlled ? controlledFilter : internalFilter;
  const setGlobalFilter = useCallback(
    (value: string) => {
      if (isControlled) {
        onFilterChange?.(value);
      } else {
        setInternalFilter(value);
      }
    },
    [isControlled, onFilterChange],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: withFilter ? getFilteredRowModel() : undefined,
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    state: { globalFilter },
  });

  return (
    <div className="flex flex-col gap-4">
      {(withFilter || toolbar) && (
        <div className="flex items-center gap-4">
          {withFilter && (
            <SearchField
              value={globalFilter}
              onChange={setGlobalFilter}
              className="relative min-w-0 flex-1"
              aria-label="Suche"
            >
              <SearchIcon
                size={14}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-40"
              />
              <Input placeholder={filterPlaceholder} className="w-full pl-8" />
            </SearchField>
          )}
          {toolbar && <div className="ml-auto">{toolbar}</div>}
        </div>
      )}

      <div className="bg-surface border-surface rounded-md border px-4 py-2">
        <table className="w-full [border-spacing:0] text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-input border-b text-left">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-subtle px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase first:pl-2 first:xs:pl-4 last:pr-2 last:xs:pr-4 ${header.column.columnDef.meta?.className ?? ""}`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-input border-b last:border-b-0">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={`px-2 py-2 first:pl-2 first:xs:pl-4 last:pr-2 last:xs:pr-4 ${cell.column.columnDef.meta?.className ?? ""}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-subtle px-4 py-6 text-center">
                  Keine Einträge vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
