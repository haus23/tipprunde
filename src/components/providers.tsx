"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { I18nProvider } from "react-aria-components";

import { AppToastRegion } from "#/components/(ui)/toast.tsx";
import { queryClient } from "#/utils/query-client.ts";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider locale="de-DE">
      <QueryClientProvider client={queryClient}>
        {children}
        <AppToastRegion />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </I18nProvider>
  );
}
