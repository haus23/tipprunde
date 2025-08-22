import { Button as AriaButton, type ButtonProps as AriaButtonProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends AriaButtonProps {
  variant?: "default" | "ghost";
  size?: "default" | "sm" | "lg";
}

const buttonVariants = {
  variant: {
    default: "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-700",
    ghost: "hover:bg-gray-100 active:bg-gray-200",
  },
  size: {
    default: "px-3 py-2",
    sm: "p-2",
    lg: "px-4 py-3",
  },
};

export function Button({ 
  className, 
  variant = "default", 
  size = "default", 
  ...props 
}: ButtonProps) {
  return (
    <AriaButton
      className={twMerge(
        "rounded-md font-medium transition-colors",
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        className
      )}
      {...props}
    />
  );
}