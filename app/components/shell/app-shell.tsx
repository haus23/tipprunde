import { tv } from 'tailwind-variants';

import { AppHeader } from '~/components/shell/app-header';
import { AppSidebar } from '~/components/shell/app-sidebar';

const SIDEBAR_WIDTH = '12rem';

export interface AppShellProps extends React.ComponentProps<'div'> {
  nav: React.ReactNode;
}

const shellStyles = tv({
  base: [
    'isolate min-h-svh w-full',
    'grid grid-cols-[0_1fr] md:grid-cols-[var(--sidebar-width)_1fr]',
  ],
});

export function AppShell({
  children,
  className,
  nav,
  style,
  ...props
}: AppShellProps) {
  return (
    <div
      style={
        {
          '--sidebar-width': SIDEBAR_WIDTH,
          ...style,
        } as React.CSSProperties
      }
      className={shellStyles({ className })}
      {...props}
    >
      <AppSidebar>{nav}</AppSidebar>
      <div className="grid grid-rows-[auto_1fr]">
        <AppHeader />
        <main className="pb-8 sm:px-2 md:px-4">{children}</main>
      </div>
    </div>
  );
}
