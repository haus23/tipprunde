"use client";

import { useState } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/(ui)/button";
import { Dialog } from "@/components/(ui)/dialog";
import type { rulesets } from "@/lib/db/schema";
import { RegelwerkForm } from "./regelwerk-form";

type Regelwerk = typeof rulesets.$inferSelect;

interface Props {
  regelwerke: Regelwerk[];
}

export function RegelwerkeTable({ regelwerke }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Regelwerk | undefined>(undefined);

  function openCreate() {
    setEditTarget(undefined);
    setIsOpen(true);
  }

  function openEdit(r: Regelwerk) {
    setEditTarget(r);
    setIsOpen(true);
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between px-4 sm:px-0">
        <h1 className="text-2xl font-medium">Regelwerke</h1>
        <Button onPress={openCreate}>Neu anlegen</Button>
      </div>

      <table className="w-full text-sm [border-spacing:0]">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="py-2 pl-4 pr-2 font-medium">Name</th>
            <th className="w-full px-2 py-2 font-medium">Beschreibung</th>
            <th className="py-2 pl-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {regelwerke.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle px-4 py-6 text-center text-sm">
                Keine Regelwerke vorhanden.
              </td>
            </tr>
          ) : (
            regelwerke.map((r) => (
              <tr key={r.id} className="border-input border-b">
                <td className="py-2 pl-4 pr-2">{r.name}</td>
                <td className="max-w-0 truncate px-2 py-2">{r.description}</td>
                <td className="py-2 pl-2 pr-4 text-right">
                  <Button
                    variant="secondary"
                    size="icon"
                    onPress={() => openEdit(r)}
                    aria-label="Bearbeiten"
                  >
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
        title={editTarget ? "Regelwerk bearbeiten" : "Neues Regelwerk anlegen"}
      >
        <RegelwerkForm
          key={editTarget?.id ?? "new"}
          regelwerk={editTarget}
        />
      </Dialog>
    </>
  );
}
