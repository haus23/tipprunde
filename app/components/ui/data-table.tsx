import type { ColumnDef, Table as TableType } from '@tanstack/react-table';

import {
  flexRender,
  getCoreRowModel,
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

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  withPagination?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  withPagination = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: withPagination ? getPaginationRowModel() : undefined,
  });

  return (
    <div className="flex flex-col gap-y-4">
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
    <div className="my-2 flex justify-center gap-x-4">
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
      <Separator orientation="vertical" />
      <div className="flex items-center font-medium text-app-11 text-sm">
        Seite {table.getState().pagination.pageIndex + 1} von{' '}
        {table.getPageCount()}
      </div>
      <Separator orientation="vertical" />
      <div className="flex gap-x-2">
        <Button
          variant="outline"
          iconOnly
          onClick={() => table.setPageIndex(0)}
          isDisabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeftIcon className="size-5" />
        </Button>
        <Button
          variant="outline"
          iconOnly
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
        <Button
          variant="outline"
          iconOnly
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          <ChevronRightIcon className="size-5" />
        </Button>
        <Button
          variant="outline"
          iconOnly
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          isDisabled={!table.getCanNextPage()}
        >
          <ChevronsRightIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
