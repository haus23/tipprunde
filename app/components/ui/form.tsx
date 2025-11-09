import {
  Form as _Form,
  type FormProps as _FormProps,
} from "react-aria-components";
import { cva } from "~/utils/cva";

const formClasses = cva({ base: "flex flex-col gap-4" });

export interface FormProps extends _FormProps {
  ref?: React.RefObject<HTMLFormElement | null>;
}

export function Form({ className, ref, ...props }: FormProps) {
  return <_Form ref={ref} className={formClasses({ className })} {...props} />;
}
