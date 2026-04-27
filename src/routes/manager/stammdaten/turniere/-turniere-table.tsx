"use client";

import { useMemo, useState } from "react";

import { Button } from "#/components/(ui)/button.tsx";
import { DataTable } from "#/components/(ui)/data-table.tsx";
import { Dialog } from "#/components/(ui)/dialog.tsx";
import type { Championship } from "#db/dal/championships.ts";
import type { Ruleset } from "#db/dal/rulesets.ts";

import { createTurnierColumns } from "./-turnier-columns.tsx";
import { TurnierForm } from "./-turnier-form.tsx";

interface Props {
  turniere: Championship[];
  regelwerke: Ruleset[];
}

export function TurniereTable({ turniere, regelwerke }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const nextNr = (turniere[0]?.nr ?? 0) + 1;
  const columns = useMemo(() => createTurnierColumns(), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={turniere}
        toolbar={<Button onPress={() => setIsOpen(true)}>Neu anlegen</Button>}
      />

      <Dialog isOpen={isOpen} onOpenChange={setIsOpen} title="Neues Turnier anlegen">
        <TurnierForm key={isOpen ? "open" : "closed"} regelwerke={regelwerke} nextNr={nextNr} />
      </Dialog>
    </>
  );
}
