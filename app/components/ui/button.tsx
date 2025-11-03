import { cva, type VariantProps } from "~/utils/cva";

const buttonClasses = cva({
  base: [],
  variants: {
    variant: {
      plain: "",
    },
  },
  defaultVariants: {
    variant: "plain",
  },
});

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonClasses> {}

export function Button({ className, variant, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses({ className, variant })} {...props} />
  );
}
