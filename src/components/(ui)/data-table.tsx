import type { ColumnDef, Table as TableType } from "@tanstack/react-table";
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
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SearchIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/(ui)/button.tsx";
import { SearchField, Input } from "@/components/(ui)/text-field.tsx";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  withFilter?: boolean;
  filterPlaceholder?: string;
  withPagination?: boolean;
  toolbar?: ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  withFilter = false,
  filterPlaceholder = "Suchen …",
  withPagination = false,
  toolbar,
}: DataTableProps<TData, TValue>) {
  const shouldResetPageIndexRef = useRef(false);
  const autoResetPageIndex = shouldResetPageIndexRef.current;

  const resetPageIndex = useCallback(() => {
    shouldResetPageIndexRef.current = true;
  }, []);

  useEffect(() => {
    if (autoResetPageIndex) shouldResetPageIndexRef.current = false;
  }, [autoResetPageIndex]);

  const [globalFilter, setInternalGlobalFilter] = useState("");
  const setGlobalFilter = useCallback(
    (value: string) => {
      resetPageIndex();
      setInternalGlobalFilter(value);
    },
    [resetPageIndex],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: withFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: withPagination ? getPaginationRowModel() : undefined,
    autoResetPageIndex,
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
                    className={`px-2 py-2 font-medium first:pl-4 last:pr-4 ${header.column.columnDef.meta?.className ?? ""}`}
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
                      className={`px-2 py-2 first:pl-4 last:pr-4 ${cell.column.columnDef.meta?.className ?? ""}`}
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

      {withPagination && <DataTablePagination table={table} />}
    </div>
  );
}

function DataTablePagination<TData>({ table }: { table: TableType<TData> }) {
  return (
    <div className="text-subtle flex items-center justify-center gap-4 text-sm">
      <span className="font-medium">
        Seite {table.getState().pagination.pageIndex + 1} von {table.getPageCount()}
      </span>
      <div className="flex gap-1">
        <Button
          variant="secondary"
          size="icon"
          onPress={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
          aria-label="Erste Seite"
        >
          <ChevronsLeftIcon size={14} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onPress={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
          aria-label="Vorherige Seite"
        >
          <ChevronLeftIcon size={14} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onPress={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
          aria-label="Nächste Seite"
        >
          <ChevronRightIcon size={14} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onPress={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
          aria-label="Letzte Seite"
        >
          <ChevronsRightIcon size={14} />
        </Button>
      </div>
    </div>
  );
}
