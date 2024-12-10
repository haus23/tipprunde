import {
  type DialogProps,
  DialogTrigger,
  type DialogTriggerProps,
  Modal,
  ModalOverlay,
  Dialog as RACDialog,
} from 'react-aria-components';
import { type VariantProps, tv } from '#/utils/tv';

const dialogStyles = tv({
  slots: {
    modal: 'rounded-md bg-white shadow-xs ring-1 ring-grey-6 dark:bg-grey-1',
    panel: 'outline-hidden',
  },
});

const { modal, panel } = dialogStyles();

namespace Dialog {
  export interface Props extends DialogTriggerProps {}
}

export function Dialog({ ...props }: Dialog.Props) {
  return <DialogTrigger {...props} />;
}

namespace DialogPanel {
  export interface Props
    extends DialogProps,
      VariantProps<typeof dialogStyles> {}
}

export function DialogPanel({ className, ...props }: DialogPanel.Props) {
  return (
    <ModalOverlay className="fixed inset-0 backdrop-blur-xs" isDismissable>
      <Modal className={modal({ className })}>
        <RACDialog className={panel()} {...props} />
      </Modal>
    </ModalOverlay>
  );
}
