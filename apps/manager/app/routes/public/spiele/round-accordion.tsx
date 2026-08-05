import { Disclosure } from "@tipprunde/ui";
import type { ReactNode } from "react";

interface Props {
  title: string;
  meta?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function RoundAccordion({ title, meta, defaultOpen, children }: Props) {
  return (
    <Disclosure
      name="runden"
      title={title}
      meta={meta}
      defaultOpen={defaultOpen}
      className="border-subtle border-b last:border-b-0"
    >
      {children}
    </Disclosure>
  );
}
