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
      className={twMerge('isolate flex min-h-svh w-full', className)}
      {...props}
    >
      <div className="w-[var(--sidebar-width)] border-app-6 border-r shadow-sm">
        <AppSidebar />
      </div>
      <main className="grow p-4">{children}</main>
    </div>
  );
}
