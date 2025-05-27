import type { ColumnDef, Table as TableType } from '@tanstack/react-table';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Select, SelectItem } from '~/components/ui/select';
import { Separator } from '~/components/ui/seperator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { SearchField } from '~/components/ui/text-field';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  withFilter?: boolean;
  withPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  withFilter = false,
  withPagination = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    enableMultiRowSelection: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: withFilter ? getFilteredRowModel() : undefined,
    getPaginationRowModel: withPagination ? getPaginationRowModel() : undefined,
    globalFilterFn: 'includesString',
    autoResetPageIndex: false,
  });

  return (
    <div className="flex flex-col gap-y-4">
      {withFilter && (
        <div className="p-2">
          <SearchField
            onChange={(value) => table.setGlobalFilter(value)}
            label="Filter:"
            labelClasses="text-app-11 font-medium"
            className="text-sm"
            placeholder="Suche nach ..."
            orientation="horizontal"
          />
        </div>
      )}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Keine Daten.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {withPagination && <DataTablePagination table={table} />}
    </div>
  );
}

interface DataTablePaginationProps<TData> {
  table: TableType<TData>;
}

function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="mx-2 my-2 flex flex-col items-center justify-center gap-x-4 gap-y-3 sm:mx-0 sm:flex-row">
      <div className="flex items-center font-medium text-app-11 text-sm">
        Seite {table.getState().pagination.pageIndex + 1} von{' '}
        {table.getPageCount()}
      </div>
      <Separator
        className="hidden self-stretch sm:block"
        orientation="vertical"
      />
      <div className="flex gap-x-2">
        <Button
          iconOnly
          onClick={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeftIcon className="size-5" />
        </Button>
        <Button
          iconOnly
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
        <Button
          iconOnly
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="size-5" />
        </Button>
        <Button
          iconOnly
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
        >
          <ChevronsRightIcon className="size-5" />
        </Button>
      </div>
      <Separator
        className="hidden self-stretch sm:block"
        orientation="vertical"
      />
      <div>
        <Select
          label="Zeilen pro Seite"
          labelClasses="text-app-11 font-medium"
          placeholder={`${table.getState().pagination.pageSize}`}
          selectedKey={`${table.getState().pagination.pageSize}`}
          onSelectionChange={(key) => table.setPageSize(Number(key))}
          orientation="horizontal"
          placement="top start"
        >
          {[10, 20, 30, 40, 50]
            .map((elt) => ({ size: elt }))
            .map((pageSize) => (
              <SelectItem
                textValue={`${pageSize.size}`}
                key={`${pageSize.size}`}
                id={`${pageSize.size}`}
                value={pageSize}
                className="w-32 tabular-nums"
              >
                {pageSize.size}
              </SelectItem>
            ))}
        </Select>
      </div>
    </div>
  );
}
