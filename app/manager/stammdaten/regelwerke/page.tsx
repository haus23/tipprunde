import { db } from "@/lib/db";
import { RegelwerkeTable } from "./regelwerke-table";

export default async function RegelwerkePage() {
  const regelwerke = await db.query.rulesets.findMany({
    orderBy: { name: "asc" },
  });

  return <RegelwerkeTable regelwerke={regelwerke} />;
}
