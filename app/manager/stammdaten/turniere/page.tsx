import { db } from "@/lib/db";
import { TurniereTable } from "./turniere-table";

export default async function TurnierePage() {
  const [turniere, regelwerke] = await Promise.all([
    db.query.championships.findMany({ orderBy: { nr: "desc" }, with: { ruleset: true } }),
    db.query.rulesets.findMany({ orderBy: { name: "asc" } }),
  ]);

  return <TurniereTable turniere={turniere} regelwerke={regelwerke} />;
}
