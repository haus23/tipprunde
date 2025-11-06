import { Form as _Form, type FormProps } from "react-aria-components";
import { cva } from "~/utils/cva";

const formClasses = cva({ base: "flex flex-col gap-4" });

export function Form({ className, ...props }: FormProps) {
  return <_Form className={formClasses({ className })} {...props} />;
}
