"use client";

import {
  FieldError as RACFieldError,
  type FieldErrorProps,
  Input as RACInput,
  type InputProps,
  Label as RACLabel,
  type LabelProps,
  TextField as RACTextField,
  type TextFieldProps,
} from "react-aria-components";

import { cn } from "#/utils/cn.ts";

export function TextField(props: TextFieldProps) {
  return <RACTextField {...props} />;
}

export function Label(props: LabelProps) {
  return <RACLabel {...props} className="text-subtle text-sm" />;
}

interface InputComponentProps extends Omit<InputProps, "className"> {
  className?: string;
}

export function Input({ className, ...props }: InputComponentProps) {
  return (
    <RACInput
      {...props}
      className={cn("border-input data-hovered:border-input-hovered focus-visible:ring-focus data-invalid:border-error rounded-md border bg-transparent px-3 py-2 text-sm outline-none transition-colors duration-150 ease-out focus-visible:ring-2 disabled:opacity-50", className)}
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} className="text-error text-sm" />;
}
