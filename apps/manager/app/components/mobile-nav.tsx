import { Logo } from "@tipprunde/ui";
import { useEffect } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { useLocation } from "react-router";

import { useShell } from "#/components/shell-provider.tsx";
import { SidebarNav } from "#/components/sidebar.tsx";

type MobileNavProps = {
  slug: string | undefined;
  webAppUrl: string;
};

/** Mobile-only drawer (< md). Slides in from the left, closes on navigation. */
export function MobileNav({ slug, webAppUrl }: MobileNavProps) {
  const { isMobileMenuOpen, closeMobileMenu } = useShell();
  const { pathname } = useLocation();

  // Close on route change (NavLink also calls closeMobileMenu directly).
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  return (
    <ModalOverlay
      isOpen={isMobileMenuOpen}
      onOpenChange={(open) => {
        if (!open) closeMobileMenu();
      }}
      isDismissable
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-200 ease-out data-entering:opacity-0 data-exiting:opacity-0 md:hidden"
    >
      <Modal className="bg-surface-raised border-subtle fixed inset-y-0 left-0 flex w-64 flex-col border-r transition-transform duration-300 ease-out data-entering:-translate-x-full data-exiting:-translate-x-full">
        <Dialog aria-label="Navigation" className="flex h-full flex-col outline-none">
          <div className="border-subtle flex h-14 shrink-0 items-center border-b px-2">
            <a
              href={webAppUrl}
              className="hover:bg-nav-active focus-visible:ring-accent flex h-9 w-full items-center gap-2.5 rounded-sm px-2 focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="text-accent size-7 shrink-0">
                <Logo />
              </div>
              <span className="text-sm font-semibold">runde.tips</span>
            </a>
          </div>

          <SidebarNav slug={slug} collapsed={false} onNavigate={closeMobileMenu} />
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
