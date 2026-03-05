import type React from "react";

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="relative isolate min-h-svh w-full">{children}</body>
    </html>
  );
}
