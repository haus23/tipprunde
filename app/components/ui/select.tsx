import type {
  ListBoxItemProps as _ListBoxItemProps,
  SelectProps as _SelectProps,
  PopoverProps,
} from 'react-aria-components';

import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import {
  Select as _Select,
  ListBox,
  ListBoxItem,
  SelectValue,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { focusVisibleStyles } from '~/components/ui/_common';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Popover } from '~/components/ui/popover';

interface SelectProps<T extends object>
  extends Omit<_SelectProps<T>, 'children'> {
  label?: string;
  labelClasses?: string;
  items?: Iterable<T>;
  orientation?: 'vertical' | 'horizontal';
  placement?: PopoverProps['placement'];
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

const itemStyles = tv({
  base: [
    focusVisibleStyles,
    'flex items-center justify-between gap-x-2',
    'rounded-md px-2 py-1.5 text-app-11 text-sm',
    'transition-colors data-focused:bg-app-3 data-focused:text-app-12',
  ],
});

export function Select<T extends object>({
  label,
  labelClasses,
  children,
  items,
  placement,
  ...props
}: SelectProps<T>) {
  return (
    <_Select {...props} className="flex items-center gap-x-4">
      <Label className={labelClasses}>{label}</Label>
      <Button variant="select">
        <SelectValue />
        <ChevronsUpDownIcon className="size-5" />
      </Button>
      <Popover placement={placement} className="min-w-[var(--trigger-width)]">
        <ListBox className="space-y-1 p-1.5" items={items}>
          {children}
        </ListBox>
      </Popover>
    </_Select>
  );
}

interface ListBoxItemProps extends _ListBoxItemProps {
  className?: string;
}

export function SelectItem({
  children,
  className,
  ...props
}: ListBoxItemProps) {
  return (
    <ListBoxItem className={itemStyles({ className })} {...props}>
      {({ isSelected }) => (
        <>
          {children}
          {isSelected && <CheckIcon className="size-5" />}
        </>
      )}
    </ListBoxItem>
  );
}
