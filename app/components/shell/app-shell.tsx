import { tv } from 'tailwind-variants';

import { AppSidebar } from '~/components/shell/app-sidebar';
import { ThemeMenu } from '~/components/theme-menu';

const SIDEBAR_WIDTH = '16rem';

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
      <main className="grow p-4">{children}</main>
      <div className="absolute top-2 right-4">
        <ThemeMenu />
      </div>
    </div>
  );
}
