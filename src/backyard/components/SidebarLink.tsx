import { ElementType, forwardRef } from 'react';
import { NavLink, NavLinkProps, useMatch } from 'react-router-dom';
import { classNames } from '@/core/helpers/class-names';

type SidebarLinkProps = NavLinkProps & {
  icon: ElementType;
};

const SidebarLink = forwardRef<HTMLAnchorElement, SidebarLinkProps>(
  ({ icon, to, children, ...props }, ref) => {
    const Icon = icon;

    const match = useMatch(typeof to === 'string' ? to : to.pathname ?? '');
    return (
      <NavLink
        ref={ref}
        to={to}
        {...props}
        className={({ isActive }) =>
          classNames(
            isActive
              ? 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white',
            'group flex items-center px-2 py-2 text-base font-medium rounded-md'
          )
        }
      >
        <Icon
          className={classNames(
            match
              ? 'text-gray-500 dark:text-gray-300'
              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
            'mr-3 flex-shrink-0 h-6 w-6'
          )}
        />
        {children}
      </NavLink>
    );
  }
);

SidebarLink.displayName = 'SidebarLink';

export default SidebarLink;
