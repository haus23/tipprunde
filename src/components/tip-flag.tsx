"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Button, Popover } from "react-aria-components";

interface Props {
  label: string;
}

export function TipFlag({ label }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;
    function handleOutsideClick(ev: PointerEvent) {
      if (
        buttonRef.current?.contains(ev.target as Node) ||
        popoverRef.current?.contains(ev.target as Node)
      )
        return;
      setIsOpen(false);
    }
    window.addEventListener("pointerdown", handleOutsideClick, { capture: true });
    return () => window.removeEventListener("pointerdown", handleOutsideClick, { capture: true });
  }, [isOpen]);

  return (
    <>
      <Button
        ref={buttonRef}
        onPress={() => setIsOpen((v) => !v)}
        aria-label="Zusatzinfos zum Tipp"
        className="text-accent focus-visible:ring-focus xs:right-1 absolute top-1/2 -right-1.25 -translate-y-1/2 cursor-default rounded transition-transform outline-none focus-visible:ring-1 active:scale-[0.97]"
      >
        ★
      </Button>
      <Popover
        ref={popoverRef}
        triggerRef={buttonRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isNonModal
        placement="bottom"
        className="bg-inverted text-inverted rounded px-2 py-1 text-xs data-entering:animate-[popover-enter_150ms_var(--ease-out)] data-exiting:animate-[popover-exit_100ms_var(--ease-out)_forwards] data-[placement=bottom]:origin-top data-[placement=top]:origin-bottom"
      >
        {label}
      </Popover>
    </>
  );
}
