import { XIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { Button } from "../ui/button";
import { Link } from "../ui/link";
import { Logo } from "./logo";
import { useShell } from "./provider";

export function MobileSidebar({ children }: { children: React.ReactNode }) {
  const { isMobileMenuOpen, setMobileMenuOpen } = useShell();

  return (
    <DialogTrigger isOpen={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <Button className="hidden">Open Menu</Button>
      <ModalOverlay
        className="fixed inset-0 z-40 bg-black/50 md:hidden"
        isDismissable
      >
        <Modal className="fixed top-0 bottom-0 left-0 z-50 w-64 focus-visible:outline-none md:hidden">
          <Dialog
            className="h-full flex flex-col gap-1 border-r border-default bg-raised pb-2 overflow-y-auto focus-visible:outline-none"
            aria-label="Navigation menu"
          >
            {({ close }) => (
              <>
                <div className="px-2 py-1 flex items-center justify-between sticky top-0 bg-raised z-10">
                  <Link
                    to="/"
                    className="flex items-center pl-0.5 pr-2 gap-1 overflow-hidden"
                    onClick={close}
                  >
                    <Logo className="size-8 shrink-0" />
                    <span className="text-xl font-medium">runde.tips</span>
                  </Link>
                  <Button variant="ghost" onPress={close} className="shrink-0">
                    <XIcon className="size-5" />
                  </Button>
                </div>
                <div className="grow flex flex-col" onClick={close}>
                  {children}
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  );
}
