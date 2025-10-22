import {
  TextField as _TextField,
  type TextFieldProps,
} from "react-aria-components";
import { cva } from "~/utils/cva";

const textFieldClasses = cva({
  base: ["flex flex-col gap-1"],
});

export function TextField({ className, ...props }: TextFieldProps) {
  return <_TextField className={textFieldClasses({ className })} {...props} />;
}
