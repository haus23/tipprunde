import { useLayoutEffect, useRef, useState } from "react";
import { Button, Popover } from "react-aria-components";

interface Props {
  label: string;
}

/**
 * Accent star marking a joker tip. Tap/click toggles a small label popover —
 * a controlled Popover (not a hover Tooltip) so the hint is reachable on touch.
 */
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
        aria-label={label}
        className="text-accent focus-visible:ring-accent xs:right-1 absolute top-1/2 -right-1.5 -translate-y-1/2 cursor-default rounded-sm transition-transform outline-none focus-visible:ring-2 active:scale-[0.97]"
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
        className="bg-inverted text-inverted shadow-popover rounded-sm px-2 py-1 text-xs transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0 data-[placement=bottom]:origin-top data-[placement=top]:origin-bottom"
      >
        {label}
      </Popover>
    </>
  );
}
