import { ComponentPropsWithoutRef, forwardRef } from 'react';

type NavButtonProps = ComponentPropsWithoutRef<'button'>;

const NavButton = forwardRef<HTMLButtonElement, NavButtonProps>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className="text-gray-400 hover:text-gray-500 dark:hover:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 dark:focus:ring-white"
      type="button"
    >
      {children}
    </button>
  )
);
NavButton.displayName = 'NavButton';

export default NavButton;
