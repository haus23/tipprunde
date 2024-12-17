import { motion } from 'motion/react';
import { useContext, useEffect, useState } from 'react';
import {
  type DialogProps,
  DialogTrigger,
  type DialogTriggerProps,
  Modal,
  ModalOverlay,
  OverlayTriggerStateContext,
  Dialog as RACDialog,
} from 'react-aria-components';

import { type VariantProps, tv } from '#/utils/tv';

const MotionModal = motion.create(Modal);
const MotionModalOverlay = motion.create(ModalOverlay);

type AnimationState = 'unmounted' | 'hidden' | 'visible';

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
  const [animation, setAnimation] = useState<AnimationState>('unmounted');
  const ctx = useContext(OverlayTriggerStateContext);

  useEffect(() => {
    setAnimation((a) =>
      ctx?.isOpen === true ? 'visible' : a === 'unmounted' ? a : 'hidden',
    );
  }, [ctx?.isOpen]);

  return (
    <MotionModalOverlay
      className="fixed inset-0 backdrop-blur-xs"
      isDismissable
      isExiting={animation === 'hidden'}
      onAnimationComplete={(animation) => {
        setAnimation((a) =>
          animation === 'hidden' && a === 'hidden' ? 'unmounted' : a,
        );
      }}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }}
      initial="hidden"
      animate={animation}
    >
      <MotionModal
        className={modal({ className })}
        variants={{
          hidden: { opacity: 0, y: -200 },
          visible: { opacity: 1, y: 0 },
        }}
      >
        <RACDialog className={panel()} {...props} />
      </MotionModal>
    </MotionModalOverlay>
  );
}
