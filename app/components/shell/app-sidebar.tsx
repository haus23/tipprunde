import { TooltipContext } from 'react-aria-components';

import { Logo } from '~/components/shell/logo';
import { useShell } from '~/components/shell/shell-provider';
import { Link } from '~/components/ui/link';
import { TooltipTriggerContext } from '~/components/ui/tooltip';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useShell();

  return (
    <TooltipTriggerContext
      value={{ delay: 200, isDisabled: !isSidebarCollapsed }}
    >
      <TooltipContext
        value={{
          placement: 'right',
          style: { '--origin': 'translateX(-4px)' } as React.CSSProperties,
        }}
      >
        <div className="overflow-x-clip border-app-6 border-r shadow-sm">
          <div className="fixed inset-y-0 left-0 hidden w-[calc(var(--sidebar-width)-1px)] overflow-y-auto bg-app-1 md:flex md:flex-col">
            <div className="p-2 group-data-[sidebar-collapsed=true]:px-0">
              <Link
                to={'/'}
                className="flex items-center justify-center gap-x-1"
              >
                <Logo className="size-8" />
                <span className="grow text-lg group-data-[sidebar-collapsed=true]:hidden">
                  runde.tips
                </span>
              </Link>
            </div>
            <hr className="border-app-6" />
            {children}
          </div>
        </div>
      </TooltipContext>
    </TooltipTriggerContext>
  );
}
