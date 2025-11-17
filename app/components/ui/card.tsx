import type { ComponentPropsWithoutRef } from "react";
import { cva } from "~/utils/cva";

const cardClasses = cva({
  base: "rounded-lg border border-default bg-raised p-6",
});

const cardHeaderClasses = cva({
  base: "mb-4",
});

const cardTitleClasses = cva({
  base: "text-md font-semibold text-primary",
});

const cardContentClasses = cva({
  base: "",
});

export interface CardProps extends ComponentPropsWithoutRef<"div"> {}

export function Card({ className, ...props }: CardProps) {
  return <div className={cardClasses({ className })} {...props} />;
}

export interface CardHeaderProps extends ComponentPropsWithoutRef<"div"> {}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={cardHeaderClasses({ className })} {...props} />;
}

export interface CardTitleProps extends ComponentPropsWithoutRef<"h3"> {}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={cardTitleClasses({ className })} {...props} />;
}

export interface CardContentProps extends ComponentPropsWithoutRef<"div"> {}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={cardContentClasses({ className })} {...props} />;
}
