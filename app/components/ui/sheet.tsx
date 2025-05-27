import type * as React from 'react';

import { XIcon } from 'lucide-react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from 'motion/react';
import { Dialog, Heading, Modal, ModalOverlay } from 'react-aria-components';

import { Button } from '~/components/ui/button';

interface SheetProps {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  title: string;
  children?: React.ReactNode;
}

const MotionModal = motion.create(Modal);
const MotionModalOverlay = motion.create(ModalOverlay);

const inertiaTransition = {
  type: 'inertia' as const,
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};

const staticTransition = {
  duration: 0.5,
  ease: [0.32, 0.72, 0, 1],
};

const SHEET_MARGIN = 34;

export function Sheet({ children, isOpen, onOpenChange, title }: SheetProps) {
  let h = 0;
  if (typeof document !== 'undefined') {
    h = window.innerHeight - SHEET_MARGIN;
  }

  const y = useMotionValue(h);
  const bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  function setOpen(isOpen: boolean) {
    onOpenChange?.(isOpen);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionModalOverlay
          isOpen
          onOpenChange={setOpen}
          className="fixed inset-0 z-10"
          style={{ backgroundColor: bg }}
        >
          <MotionModal
            className="absolute inset-x-0 bottom-0 rounded-t-xl bg-app-2 shadow-lg will-change-transform sm:inset-x-4"
            initial={{ y: h }}
            animate={{ y: 0 }}
            exit={{ y: h }}
            transition={staticTransition}
            style={{
              y,
              top: SHEET_MARGIN,
              // Extra padding at the bottom to account for rubber band scrolling.
              paddingBottom: window.screen.height,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(_e, { offset, velocity }) => {
              if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                setOpen(false);
              } else {
                animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
              }
            }}
          >
            {/* drag affordance */}
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-app-9" />
            <Dialog className="flex flex-col items-stretch px-4 pb-4 outline-hidden">
              <div className="flex justify-end">
                <Button
                  variant="toolbar"
                  iconOnly
                  onPress={() => setOpen(false)}
                >
                  <XIcon />
                </Button>
              </div>
              <Heading slot="title" className="mb-4 font-semibold text-3xl">
                {title}
              </Heading>
              {children}
            </Dialog>
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  );
}
