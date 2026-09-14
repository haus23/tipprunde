import { StarIcon, type LucideIcon } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { Button, Popover } from "react-aria-components";

interface Props {
  label: string;
  className?: string;
  /** Defaults to the star used for the lowest-sum-bonus flag. */
  icon?: LucideIcon;
  /** Icon/focus-ring color. `accent` (default) reads as a bonus; `muted`
   * fits a neutral or negative flag (e.g. a match excluded from scoring). */
  tone?: "accent" | "muted";
}

export function CellFlag({
  label,
  className = "xs:right-1 right-0",
  icon: Icon = StarIcon,
  tone = "accent",
}: Props) {
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

  const toneClass =
    tone === "accent"
      ? "text-accent focus-visible:ring-accent"
      : "text-muted focus-visible:ring-accent";

  return (
    <>
      <Button
        ref={buttonRef}
        onPress={() => setIsOpen((v) => !v)}
        aria-label={label}
        className={`${toneClass} absolute top-1/2 inline-flex -translate-y-1/2 cursor-default items-center justify-center rounded-sm p-0.5 transition-transform outline-none focus-visible:ring-2 active:scale-[0.97] ${className}`}
      >
        <Icon className="size-3 fill-current" />
      </Button>
      <Popover
        ref={popoverRef}
        triggerRef={buttonRef}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        isNonModal
        placement="top"
        className="bg-inverted text-inverted shadow-popover rounded-sm px-2 py-1 text-xs transition duration-150 ease-out data-entering:scale-95 data-entering:opacity-0 data-exiting:scale-95 data-exiting:opacity-0 data-[placement=bottom]:origin-top data-[placement=top]:origin-bottom"
      >
        {label}
      </Popover>
    </>
  );
}
