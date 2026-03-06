import type React from "react";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="fixed inset-y-0 left-0">
        <aside className="w-64">Sidebar</aside>
      </div>
      <main className="ml-64">{children}</main>
    </div>
  );
}
