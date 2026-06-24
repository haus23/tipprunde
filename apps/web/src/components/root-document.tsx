import { HeadContent, Scripts } from "@tanstack/react-router";
import { I18nProvider } from "react-aria-components";

import type { ColorScheme } from "#/lib/session.ts";

export function RootDocument({
  children,
  colorScheme,
}: Readonly<{ children: React.ReactNode; colorScheme: ColorScheme }>) {
  return (
    <html lang="de" data-color-scheme={colorScheme}>
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nProvider locale="de-DE">{children}</I18nProvider>
        <Scripts />
      </body>
    </html>
  );
}
