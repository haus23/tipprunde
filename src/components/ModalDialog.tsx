import { Dialog } from '@headlessui/react';
import { ReactNode } from 'react';

type ModalDialogProps = {
  title: string;
  open?: boolean;
  onClose?: () => void;
  children: ReactNode;
};

export default function ModalDialog({
  title,
  open = false,
  onClose = () => undefined,
  children,
}: ModalDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      as="div"
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-700 dark:bg-opacity-75" />

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-top shadow-xl transition-all dark:bg-gray-800 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="text-xl font-semibold py-2 pl-4 sm:pl-6 border-b border-gray-300 dark:border-gray-600">
            <Dialog.Title>{title}</Dialog.Title>
          </div>
          <div className="px-4 sm:px-6 py-4">{children}</div>
        </div>
      </div>
    </Dialog>
  );
}
