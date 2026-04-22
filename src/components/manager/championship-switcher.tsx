import { useNavigate, useRouter } from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Button, Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";

const MotionOverlay = motion.create(ModalOverlay);
const MotionModal = motion.create(Modal);

interface Championship {
  slug: string;
  name: string;
}

interface Props {
  current: { name: string; slug: string | undefined };
  championships: Championship[];
}

export function ChampionshipSwitcher({ current, championships }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const navigate = useNavigate();

  async function handleSelect(championship: Championship) {
    setIsOpen(false);
    await navigate({ to: "/manager/{-$slug}", params: { slug: championship.slug } });
    router.invalidate();
  }

  if (championships.length <= 1) {
    return <span className="truncate px-2 text-sm">{current.name}</span>;
  }

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="hover:bg-subtle flex items-center gap-2 rounded-md px-2 py-1 text-sm outline-none"
      >
        <span className="truncate">{current.name}</span>
        <ChevronsUpDownIcon size={14} className="text-subtle shrink-0" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <MotionOverlay
            isOpen
            onOpenChange={setIsOpen}
            isDismissable
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
          >
            <MotionModal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
              className="border-input bg-base my-16 w-full max-w-md rounded-xl border shadow-lg"
            >
              <Dialog className="p-2 outline-none">
                <Heading slot="title" className="sr-only">
                  Turnier wechseln
                </Heading>
                <ul>
                  {championships.map((c) => (
                    <li key={c.slug}>
                      <Button
                        onPress={() => handleSelect(c)}
                        className="hover:bg-subtle flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm outline-none"
                      >
                        <span className="flex-1 text-left">{c.name}</span>
                        {c.slug === current.slug && (
                          <CheckIcon size={16} className="text-subtle shrink-0" />
                        )}
                      </Button>
                    </li>
                  ))}
                </ul>
              </Dialog>
            </MotionModal>
          </MotionOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
