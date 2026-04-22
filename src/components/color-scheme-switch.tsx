"use client";

import { useRouteContext } from "@tanstack/react-router";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { updateUISettingsFn, type ColorScheme } from "#/app/settings/ui.ts";
import { Button } from "#/components/(ui)/button.tsx";

const schemes: ColorScheme[] = ["system", "light", "dark"];

const icons: Record<ColorScheme, React.ReactNode> = {
  system: <MonitorIcon size={16} />,
  light: <SunIcon size={16} />,
  dark: <MoonIcon size={16} />,
};

const labels: Record<ColorScheme, string> = {
  system: "System-Farbschema",
  light: "Helles Farbschema",
  dark: "Dunkles Farbschema",
};

export function ColorSchemeSwitch() {
  const { uiSettings } = useRouteContext({ from: "__root__" });
  const [scheme, setScheme] = useState<ColorScheme>(uiSettings.colorScheme);

  function toggle() {
    const next = schemes[(schemes.indexOf(scheme) + 1) % schemes.length];
    setScheme(next);
    document.documentElement.dataset.colorScheme = next;
    updateUISettingsFn({ data: { colorScheme: next } });
  }

  return (
    <Button variant="plain" size="icon" aria-label={labels[scheme]} onPress={toggle}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={scheme}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", bounce: 0, duration: 0.2 }}
        >
          {icons[scheme]}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
