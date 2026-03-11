"use client";

import { useState } from "react";
import { Button } from "@/components/(ui)/button";
import { Dialog } from "@/components/(ui)/dialog";
import type { championships, rulesets } from "@/lib/db/schema";
import { TurnierForm } from "./turnier-form";

type Turnier = typeof championships.$inferSelect & {
  ruleset: typeof rulesets.$inferSelect | null;
};

interface Props {
  turniere: Turnier[];
  regelwerke: typeof rulesets.$inferSelect[];
}

export function TurniereTable({ turniere, regelwerke }: Props) {
  const nextNr = (turniere[0]?.nr ?? 0) + 1;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between px-4 sm:px-0">
        <h1 className="text-2xl font-medium">Turniere</h1>
        <Button onPress={() => setIsOpen(true)}>Neu anlegen</Button>
      </div>

      <table className="w-full text-sm [border-spacing:0]">
        <thead>
          <tr className="border-input border-b text-left">
            <th className="py-2 pl-4 pr-2 font-medium">#</th>
            <th className="w-full px-2 py-2 font-medium">Name</th>
            <th className="hidden px-2 py-2 font-medium sm:table-cell">Regelwerk</th>
          </tr>
        </thead>
        <tbody>
          {turniere.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-subtle px-4 py-6 text-center text-sm">
                Keine Turniere vorhanden.
              </td>
            </tr>
          ) : (
            turniere.map((t) => (
              <tr key={t.id} className="border-input border-b">
                <td className="py-2 pl-4 pr-2">{t.nr}</td>
                <td className="px-2 py-2">{t.name}</td>
                <td className="hidden px-2 py-2 sm:table-cell">{t.ruleset?.name}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Neues Turnier anlegen">
        <TurnierForm
          key={isOpen ? "open" : "closed"}
          regelwerke={regelwerke}
          nextNr={nextNr}
        />
      </Dialog>
    </>
  );
}
