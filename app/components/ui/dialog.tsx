import {
  Dialog as RACDialog,
  DialogTrigger as RACDialogTrigger,
  Heading,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { cva } from "~/utils/cva";

export { Heading as DialogTitle };
export const DialogTrigger = RACDialogTrigger;

const overlayClasses = cva({
  base: [
    "fixed inset-0 z-50",
    "bg-black/50",
    "flex items-center justify-center p-4",
  ],
});

const modalClasses = cva({
  base: [
    "w-full max-w-md",
    "rounded-lg border border-default bg-raised shadow-lg",
    "p-6",
    "focus-visible:outline-none",
  ],
});

export function DialogOverlay({ children }: { children: React.ReactNode }) {
  return (
    <ModalOverlay className={overlayClasses()}>
      <Modal className={modalClasses()}>{children}</Modal>
    </ModalOverlay>
  );
}

const dialogClasses = cva({
  base: "flex flex-col gap-4 focus-visible:outline-none",
});

export function Dialog({ children }: { children: React.ReactNode }) {
  return <RACDialog className={dialogClasses()}>{children}</RACDialog>;
}
