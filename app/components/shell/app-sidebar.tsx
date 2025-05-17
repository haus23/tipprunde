import { useEffect } from 'react';
import {
  Dialog,
  Modal,
  ModalOverlay,
  TooltipContext,
} from 'react-aria-components';

import { Logo } from '~/components/shell/logo';
import { useShell } from '~/components/shell/shell-provider';
import { ActionContext } from '~/components/ui/action-context';
import { Link } from '~/components/ui/link';
import { TooltipTriggerContext } from '~/components/ui/tooltip';
import { useIsMobile } from '~/utils/misc';

export function AppSidebar({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed, isMobileNavOpen, setMobileNavOpen } = useShell();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) setMobileNavOpen(false);
  }, [isMobile, setMobileNavOpen]);

  return (
    <>
      <TooltipTriggerContext
        value={{ delay: 200, isDisabled: !isSidebarCollapsed }}
      >
        <TooltipContext
          value={{
            placement: 'right',
            style: { '--origin': 'translateX(-4px)' } as React.CSSProperties,
          }}
        >
          <div className="overflow-x-clip border-r shadow-sm">
            <div className="fixed inset-y-0 left-0 hidden w-[calc(var(--sidebar-width)-1px)] overflow-y-auto bg-app-1 font-medium md:flex md:flex-col">
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
              <hr />
              {children}
            </div>
          </div>
        </TooltipContext>
      </TooltipTriggerContext>

      <ModalOverlay
        isOpen={isMobileNavOpen}
        onOpenChange={setMobileNavOpen}
        isDismissable
        className="fixed inset-0 bg-app-bg/50 backdrop-blur-[2px]"
      >
        <Modal className="fixed inset-y-0 left-0 w-[calc(12rem-1px)] bg-app-1 shadow-app-4 shadow-lg">
          <ActionContext value={{ onAction: () => setMobileNavOpen(false) }}>
            <Dialog
              className="flex h-full flex-col justify-between overflow-y-auto font-medium outline-hidden"
              aria-label="Mobile Navigation"
            >
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
              <hr />
              {children}
            </Dialog>
          </ActionContext>
        </Modal>
      </ModalOverlay>
    </>
  );
}
