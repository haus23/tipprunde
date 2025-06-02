import type * as React from 'react';
import type { DisclosureProps } from 'react-aria-components';

import { ChevronRightIcon } from 'lucide-react';
import { createContext, useState } from 'react';
import {
  Button,
  Disclosure,
  DisclosurePanel,
  Heading,
} from 'react-aria-components';

export const CollapsibleContext = createContext<{
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean) => void;
}>(undefined as never);

interface CollapsibleProps extends DisclosureProps {
  title: string;
  children?: React.ReactNode;
}

export function Collapsible({ children, title, ...props }: CollapsibleProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <CollapsibleContext value={{ isExpanded, setIsExpanded }}>
      <Disclosure
        {...props}
        isExpanded={isExpanded}
        onExpandedChange={setIsExpanded}
      >
        <Heading level={2} className="font-medium text-lg">
          <Button slot="trigger" className="group flex items-center gap-x-2">
            <ChevronRightIcon className="size-5 transition-transform group-aria-[expanded=true]:rotate-90" />
            {title}
          </Button>
        </Heading>
        <DisclosurePanel>{children}</DisclosurePanel>
      </Disclosure>
    </CollapsibleContext>
  );
}
