import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#db";
import { users } from "../schema/tables.ts";

export const getUsers = createServerOnlyFn(async () =>
  db.query.users.findMany({
    where: { id: { gt: 0 } },
    orderBy: { name: "asc" },
  }),
);

export const createUser = createServerOnlyFn(async (data: typeof users.$inferInsert) =>
  db.insert(users).values(data),
);

export const updateUser = createServerOnlyFn(async (data: typeof users.$inferInsert & { id: number }) => {
  const { id, ...rest } = data;
  return db.update(users).set(rest).where(eq(users.id, id));
});
