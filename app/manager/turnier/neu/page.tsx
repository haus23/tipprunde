import type { Metadata } from "next";
import { db } from "@/lib/db";
import { TurnierForm } from "@/app/manager/stammdaten/turniere/turnier-form";

export const metadata: Metadata = { title: "Neues Turnier" };

export default async function NeuTurnierPage() {
  const [regelwerke, latest] = await Promise.all([
    db.query.rulesets.findMany({ orderBy: { name: "asc" } }),
    db.query.championships.findFirst({ orderBy: { nr: "desc" }, columns: { nr: true } }),
  ]);

  const nextNr = (latest?.nr ?? 0) + 1;

  return (
    <div className="px-4 sm:px-0">
      <h1 className="mb-6 text-2xl font-medium">Neues Turnier</h1>
      <div className="border-input bg-base max-w-md rounded-xl border p-6 shadow-sm">
        <TurnierForm regelwerke={regelwerke} nextNr={nextNr} />
      </div>
    </div>
  );
}
