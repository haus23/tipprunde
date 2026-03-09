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

export function TextField(props: TextFieldProps) {
  return <RACTextField {...props} />;
}

export function Label(props: LabelProps) {
  return <RACLabel {...props} className="text-subtle text-sm" />;
}

export function Input(props: InputProps) {
  return (
    <RACInput
      {...props}
      className="border-input data-hovered:border-input-hovered focus-visible:ring-focus data-invalid:border-error rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 disabled:opacity-50"
    />
  );
}

export function FieldError(props: FieldErrorProps) {
  return <RACFieldError {...props} className="text-error text-sm" />;
}
