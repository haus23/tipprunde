"use client";

import { I18nProvider } from "react-aria-components";

import { AppToastRegion } from "#/components/(ui)/toast.tsx";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider locale="de-DE">
      {children}
      <AppToastRegion />
    </I18nProvider>
  );
}
