import { db } from "@/lib/db";
import { TurniereTable } from "./turniere-table";

export default async function TurnierePage() {
  const turniere = await db.query.championships.findMany({
    orderBy: { nr: "desc" },
    with: { ruleset: true },
  });

  return <TurniereTable turniere={turniere} />;
}
