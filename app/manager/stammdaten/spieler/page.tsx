import { db } from "@/lib/db";
import { SpielerTable } from "./spieler-table";

export default async function Page() {
  const spieler = await db.query.users.findMany({
    where: { id: { gt: 0 } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-medium">Spieler</h1>
      <SpielerTable spieler={spieler} />
    </div>
  );
}
