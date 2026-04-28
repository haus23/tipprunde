"use client";

import { XIcon } from "lucide-react";
import {
  Dialog as RACDialog,
  Heading,
  Modal,
  ModalOverlay,
  type ModalOverlayProps,
} from "react-aria-components";

import { Button } from "#/components/(ui)/button.tsx";

interface Props extends Pick<ModalOverlayProps, "isOpen" | "onOpenChange" | "isDismissable"> {
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onOpenChange, isDismissable = true, title, children }: Props) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[black]/50 p-4 backdrop-blur-xs data-entering:animate-[dialog-overlay-enter_150ms_ease-out] data-exiting:animate-[dialog-overlay-exit_150ms_ease-in_forwards]"
    >
      <Modal className="border-input bg-base my-auto w-full max-w-md rounded-xl border p-6 shadow-lg data-entering:animate-[dialog-enter_200ms_ease-out] data-exiting:animate-[dialog-exit_150ms_ease-in_forwards]">
        <RACDialog className="relative outline-none">
          {({ close }) => (
            <>
              <Heading slot="title" className="mb-4 pr-10 text-xl font-medium">
                {title}
              </Heading>
              {children}
              <Button
                variant="secondary"
                size="icon"
                onPress={close}
                aria-label="Schließen"
                className="absolute top-0 right-0"
              >
                <XIcon size={16} />
              </Button>
            </>
          )}
        </RACDialog>
      </Modal>
    </ModalOverlay>
  );
}
