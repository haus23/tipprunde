import type * as React from 'react';

import { tv } from 'tailwind-variants';

import { AppHeader } from '~/components/shell/app-header';
import { AppSidebar } from '~/components/shell/app-sidebar';
import { useShell } from '~/components/shell/shell-provider';

const SIDEBAR_WIDTH = '12rem';
const SIDEBAR_COLLAPSED_WIDTH = '4rem';

export interface AppShellProps extends React.ComponentProps<'div'> {
  nav: React.ReactNode;
}

const shellStyles = tv({
  base: [
    'group isolate min-h-svh w-full transition-all',
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
  const { isSidebarCollapsed } = useShell();

  return (
    <div
      style={
        {
          '--sidebar-width': isSidebarCollapsed
            ? SIDEBAR_COLLAPSED_WIDTH
            : SIDEBAR_WIDTH,
          ...style,
        } as React.CSSProperties
      }
      className={shellStyles({ className })}
      {...(isSidebarCollapsed && { 'data-sidebar-collapsed': true })}
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
