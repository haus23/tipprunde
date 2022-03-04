import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';
import { Menu } from '@headlessui/react';
import { classNames } from '@/core/helpers/class-names';

type NavMenuItemProps<T extends ElementType> = {
  as?: T;
  current: boolean;
  children: ReactNode;
};

const NavMenuItem = <T extends ElementType = 'button'>({
  as,
  current,
  children,
  ...props
}: NavMenuItemProps<T> & ComponentPropsWithoutRef<T>) => {
  const ItemComponent = as || 'button';
  return (
    <Menu.Item>
      {({ active }) => (
        <ItemComponent
          {...props}
          className={classNames(
            active
              ? 'text-gray-900 bg-gray-200 dark:text-gray-50 dark:bg-gray-700'
              : current
              ? 'text-gray-800 bg-gray-100 dark:text-gray-100 dark:bg-gray-900'
              : 'text-gray-500 dark:text-gray-200',
            'flex items-center text-sm font-medium w-full px-4 py-2'
          )}
        >
          {children}
        </ItemComponent>
      )}
    </Menu.Item>
  );
};

export default NavMenuItem;
