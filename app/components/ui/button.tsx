import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { cva, type VariantProps } from "~/utils/cva";

const buttonVariants = cva(
  "rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700",
        ghost: "hover:bg-gray-100 active:bg-gray-200",
      },
      size: {
        default: "px-3 py-2",
        sm: "p-2",
        lg: "px-4 py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps extends AriaButtonProps, VariantProps<typeof buttonVariants> {}

export function Button({ 
  className, 
  variant, 
  size, 
  ...props 
}: ButtonProps) {
  return (
    <AriaButton
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}