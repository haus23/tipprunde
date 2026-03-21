import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema.ts";
import type { users as usersSchema } from "@/lib/db/schema.ts";

type Role = (typeof usersSchema.$inferSelect)["role"];

interface PlayerData {
  name: string;
  slug: string;
  email: string | null;
  role: Role;
}

export const getPlayers = createServerOnlyFn(async () =>
  db.query.users.findMany({
    where: { id: { gt: 0 } },
    orderBy: { name: "asc" },
  }),
);

export const createPlayer = createServerOnlyFn(async (data: PlayerData) => {
  const [newUser] = await db.insert(users).values(data).returning();
  return newUser;
});

export const updatePlayer = createServerOnlyFn(async (data: PlayerData & { id: number }) => {
  const { id, ...rest } = data;
  return db.update(users).set(rest).where(eq(users.id, id));
});
