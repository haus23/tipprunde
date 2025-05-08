import { twMerge } from 'tailwind-merge';

import { AppSidebar } from '~/components/shell/app-sidebar';

const SIDEBAR_WIDTH = '16rem';

export function AppShell({
  children,
  className,
  style,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      style={
        {
          '--sidebar-width': SIDEBAR_WIDTH,
          ...style,
        } as React.CSSProperties
      }
      className={twMerge('flex', className)}
      {...props}
    >
      <AppSidebar />
      <main className="grow p-4">{children}</main>
    </div>
  );
}
