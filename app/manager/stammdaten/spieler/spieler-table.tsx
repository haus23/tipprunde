"use client";

import { useCallback, useState } from "react";
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

  const handleSuccess = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-medium">Spieler</h1>
        <Button onPress={openCreate}>Neu anlegen</Button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="pb-2 font-medium">#</th>
            <th className="pb-2 font-medium">Name</th>
            <th className="pb-2 font-medium">Kürzel</th>
            <th className="pb-2 font-medium">E-Mail</th>
            <th className="pb-2 font-medium">Rolle</th>
            <th className="pb-2" />
          </tr>
        </thead>
        <tbody>
          {spieler.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-subtle py-6 text-center text-sm">
                Keine Spieler vorhanden.
              </td>
            </tr>
          ) : (
            spieler.map((s) => (
              <tr key={s.id} className="border-input border-b">
                <td className="py-2">{s.id}</td>
                <td className="py-2">{s.name}</td>
                <td className="py-2">{s.slug}</td>
                <td className="py-2">{s.email ?? "—"}</td>
                <td className="py-2">{ROLE_LABELS[s.role]}</td>
                <td className="py-2 text-right">
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
          onSuccess={handleSuccess}
        />
      </Dialog>
    </>
  );
}
