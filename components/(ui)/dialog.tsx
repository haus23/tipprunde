"use client";

import {
  Dialog as RACDialog,
  Heading,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components";

interface Props
  extends Pick<ModalOverlayProps, "isOpen" | "onOpenChange" | "isDismissable"> {
  title: string;
  children: React.ReactNode;
}

export function Dialog({
  isOpen,
  onOpenChange,
  isDismissable = true,
  title,
  children,
}: Props) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <Modal className="border-input bg-base w-full max-w-md rounded-xl border p-6 shadow-lg">
        <RACDialog className="outline-none">
          <Heading slot="title" className="mb-4 text-xl font-medium">
            {title}
          </Heading>
          {children}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}
