import {
  TextField as AriaTextField,
  type InputProps,
  Text,
  type TextFieldProps,
} from "react-aria-components";

import { composeTailwindRenderProps } from "#/lib/compose.ts";

import { FieldError } from "./field-error.tsx";
import { Input } from "./input.tsx";
import { Label } from "./label.tsx";

interface Props extends Omit<TextFieldProps, "children"> {
  label?: string;
  description?: string;
  /** Explicit error. Omit to let RAC render the field's validation message. */
  errorMessage?: string;
  /** Escape hatch for the inner Input: extra className, onBlur, placeholder, … */
  inputProps?: InputProps;
}

export function TextField({
  label,
  description,
  errorMessage,
  inputProps,
  className,
  ...props
}: Props) {
  return (
    <AriaTextField
      {...props}
      className={composeTailwindRenderProps(className, "flex flex-col gap-1.5")}
    >
      {label && <Label>{label}</Label>}
      <Input {...inputProps} />
      {description && (
        <Text slot="description" className="text-muted text-xs">
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
    </AriaTextField>
  );
}
