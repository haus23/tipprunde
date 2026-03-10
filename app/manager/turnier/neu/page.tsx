import { db } from "@/lib/db";
import { TurnierNeuForm } from "./turnier-neu-form";

export default async function NeuTurnierPage() {
  const regelwerke = await db.query.rulesets.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="px-4 sm:px-0">
      <h1 className="mb-6 text-2xl font-medium">Neues Turnier</h1>
      <div className="max-w-md">
        <TurnierNeuForm regelwerke={regelwerke} />
      </div>
    </div>
  );
}
