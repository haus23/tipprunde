import type { ComponentPropsWithoutRef } from "react";
import { cva } from "~/utils/cva";

const tableContainerClasses = cva({
  base: "rounded-lg border border-default bg-raised overflow-hidden",
});

const tableClasses = cva({
  base: "w-full",
});

const tableHeaderClasses = cva({
  base: "",
});

const tableBodyClasses = cva({
  base: "",
});

const tableRowClasses = cva({
  base: "",
  variants: {
    variant: {
      header: "border-b border-default bg-subtle",
      body: "border-b border-default last:border-0",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

const tableHeadClasses = cva({
  base: "px-4 py-3 text-sm font-medium text-secondary",
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    align: "left",
  },
});

const tableCellClasses = cva({
  base: "px-4 py-3 text-sm",
  variants: {
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    align: "left",
  },
});

export interface TableContainerProps
  extends ComponentPropsWithoutRef<"div"> {}

export function TableContainer({
  className,
  ...props
}: TableContainerProps) {
  return <div className={tableContainerClasses({ className })} {...props} />;
}

export interface TableProps extends ComponentPropsWithoutRef<"table"> {}

export function Table({ className, ...props }: TableProps) {
  return <table className={tableClasses({ className })} {...props} />;
}

export interface TableHeaderProps extends ComponentPropsWithoutRef<"thead"> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return <thead className={tableHeaderClasses({ className })} {...props} />;
}

export interface TableBodyProps extends ComponentPropsWithoutRef<"tbody"> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={tableBodyClasses({ className })} {...props} />;
}

export interface TableRowProps extends ComponentPropsWithoutRef<"tr"> {
  variant?: "header" | "body";
}

export function TableRow({
  className,
  variant = "body",
  ...props
}: TableRowProps) {
  return (
    <tr className={tableRowClasses({ className, variant })} {...props} />
  );
}

export interface TableHeadProps extends ComponentPropsWithoutRef<"th"> {
  align?: "left" | "center" | "right";
}

export function TableHead({
  className,
  align = "left",
  ...props
}: TableHeadProps) {
  return <th className={tableHeadClasses({ className, align })} {...props} />;
}

export interface TableCellProps extends ComponentPropsWithoutRef<"td"> {
  align?: "left" | "center" | "right";
}

export function TableCell({
  className,
  align = "left",
  ...props
}: TableCellProps) {
  return <td className={tableCellClasses({ className, align })} {...props} />;
}
