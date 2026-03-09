"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/(ui)/button";
import { Dialog } from "@/components/(ui)/dialog";
import type { users } from "@/lib/db/schema";
import { SpielerForm } from "./spieler-form";

const ROLE_LABELS: Record<(typeof users.$inferSelect)["role"], string> = {
  user: "Spieler",
  manager: "Manager",
  admin: "Admin",
};

type Spieler = typeof users.$inferSelect;

interface Props {
  spieler: Spieler[];
}

export function SpielerTable({ spieler }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Spieler | undefined>(undefined);

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(s: Spieler) {
    setEditTarget(s);
    setIsOpen(true);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between px-4 sm:px-0">
        <h1 className="text-2xl font-medium">Spieler</h1>
        <Button onPress={openCreate}>Neu anlegen</Button>
      </div>

      <table className="w-full text-sm [border-spacing:0]">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="py-2 pl-4 pr-2 font-medium">#</th>
            <th className="px-2 py-2 font-medium">Kürzel</th>
            <th className="w-full px-2 py-2 font-medium">Name</th>
            <th className="hidden px-2 py-2 font-medium sm:table-cell">E-Mail</th>
            <th className="px-2 py-2 font-medium">Rolle</th>
            <th className="py-2 pl-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {spieler.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-subtle px-4 py-6 text-center text-sm">
                Keine Spieler vorhanden.
              </td>
            </tr>
          ) : (
            spieler.map((s) => (
              <tr key={s.id} className="border-input border-b">
                <td className="py-2 pl-4 pr-2">{s.id}</td>
                <td className="px-2 py-2">{s.slug}</td>
                <td className="px-2 py-2">{s.name}</td>
                <td className="hidden px-2 py-2 sm:table-cell">{s.email ?? "—"}</td>
                <td className="px-2 py-2">{ROLE_LABELS[s.role]}</td>
                <td className="py-2 pl-2 pr-4 text-right">
                  <Button variant="secondary" size="icon" onPress={() => openEdit(s)} aria-label="Bearbeiten">
                    <PencilIcon size={14} />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Dialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={editTarget ? "Spieler bearbeiten" : "Neuen Spieler anlegen"}
      >
        <SpielerForm
          key={editTarget?.id ?? "new"}
          spieler={editTarget}
        />
      </Dialog>
    </>
  );
}
