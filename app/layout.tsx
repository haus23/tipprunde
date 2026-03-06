import type React from "react";

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="bg-base relative isolate w-full text-base">{children}</body>
    </html>
  );
}
