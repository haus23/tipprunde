import { db } from "@/lib/db";
import { SpielerTable } from "./spieler-table";

export default async function Page() {
  const spieler = await db.query.users.findMany({
    where: { id: { gt: 0 } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <SpielerTable spieler={spieler} />
    </div>
  );
}
