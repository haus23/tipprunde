// TODO: migrate this hand-rolled menu to a RAC Menu once react-aria-components
// is wired into the web app. Keep the icon-button trigger styling identical.
// See docs/web-shell.md (scheme control = single button → Light/Dark/System).
import { useRouter } from "@tanstack/react-router";
import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { type ComponentType, useEffect, useRef, useState } from "react";

import { setColorScheme } from "#/lib/color-scheme.ts";
import type { ColorScheme } from "#/lib/session.ts";

const options: {
  value: ColorScheme;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}[] = [
  { value: "light", label: "Hell", Icon: SunIcon },
  { value: "dark", label: "Dunkel", Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
];

export function ColorSchemeMenu({ colorScheme }: { colorScheme: ColorScheme }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const Current = options.find((o) => o.value === colorScheme)?.Icon ?? MonitorIcon;

  async function choose(value: ColorScheme) {
    setOpen(false);
    // Optimistic: flip the attribute now so there's no flash before revalidation
    document.documentElement.setAttribute("data-color-scheme", value);
    await setColorScheme({ data: value });
    await router.invalidate();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Farbschema"
        aria-haspopup="menu"
        aria-expanded={open}
        className="text-muted hover:bg-nav-active hover:text-app focus-visible:ring-accent rounded-sm p-1.5 transition-colors outline-none focus-visible:ring-2"
      >
        <Current className="size-4" />
      </button>

      {open && (
        <div
          role="menu"
          className="border-subtle bg-surface-raised absolute right-0 mt-1 w-40 rounded-md border p-1 shadow-lg"
        >
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={colorScheme === value}
              onClick={() => void choose(value)}
              className="text-app hover:bg-nav-active flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
            >
              <Icon className="text-muted size-4 shrink-0" />
              <span className="flex-1 text-left">{label}</span>
              {colorScheme === value && <CheckIcon className="text-accent size-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
