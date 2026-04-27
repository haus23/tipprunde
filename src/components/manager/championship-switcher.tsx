"use client";

import { useRouter, useRouterState } from "@tanstack/react-router";
import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { updateManagerShellSettingsFn } from "#/app/settings/manager-shell.ts";
import {
  Autocomplete,
  Button,
  Dialog,
  Heading,
  Input,
  Menu,
  MenuItem,
  Modal,
  ModalOverlay,
  SearchField,
  useFilter,
} from "react-aria-components";

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
  const pathname = useRouterState({ select: (s) => s.resolvedLocation?.pathname ?? "" });
  const { contains } = useFilter({ sensitivity: "base" });

  async function handleSelect(slug: string) {
    setIsOpen(false);
    const isLatest = slug === championships[0].slug;

    if (isLatest) {
      await updateManagerShellSettingsFn({ data: { activeSlug: undefined } });
      await router.navigate({ to: "/manager" });
    } else {
      const slugBase = current.slug ? `/manager/${current.slug}` : null;
      const to =
        slugBase && pathname.startsWith(slugBase)
          ? pathname.replace(slugBase, `/manager/${slug}`)
          : `/manager/${slug}`;
      await router.navigate({ to });
    }
    await router.invalidate();
  }

  if (championships.length <= 1) {
    return <span className="truncate px-2 text-sm">{current.name}</span>;
  }

  return (
    <>
      <Button
        onPress={() => setIsOpen(true)}
        className="hover:bg-subtle focus-visible:ring-focus flex items-center gap-2 rounded-md px-2 py-1 text-sm outline-none focus-visible:ring-2"
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
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[black]/50 p-4 backdrop-blur-xs"
          >
            <MotionModal
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
              className="border-input bg-base my-16 w-full max-w-md overflow-hidden rounded-xl border shadow-lg"
            >
              <Dialog aria-label="Turnier wechseln" className="outline-none">
                <Heading slot="title" className="sr-only">
                  Turnier wechseln
                </Heading>
                <Autocomplete filter={contains}>
                  <SearchField
                    autoFocus
                    aria-label="Turnier suchen"
                    className="border-layout flex items-center gap-2 border-b px-3 py-3"
                  >
                    <SearchIcon size={16} className="text-subtle shrink-0" />
                    <Input
                      placeholder="Turnier suchen …"
                      className="placeholder:text-subtle flex-1 bg-transparent text-sm outline-none"
                    />
                  </SearchField>
                  <Menu
                    items={championships}
                    onAction={(key) => handleSelect(key as string)}
                    className="max-h-72 overflow-y-auto p-1"
                    renderEmptyState={() => (
                      <p className="text-subtle px-3 py-2 text-sm">Kein Turnier gefunden.</p>
                    )}
                  >
                    {(c) => (
                      <MenuItem
                        id={c.slug}
                        textValue={`${c.name} ${c.slug}`}
                        className="data-focused:bg-subtle flex cursor-default items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-150 outline-none"
                      >
                        <span className="flex-1">{c.name}</span>
                        {c.slug === current.slug && (
                          <CheckIcon size={16} className="text-subtle shrink-0" />
                        )}
                      </MenuItem>
                    )}
                  </Menu>
                </Autocomplete>
              </Dialog>
            </MotionModal>
          </MotionOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
