import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#db";
import { totpCodes } from "../schema/tables.ts";

export const createTotpCode = createServerOnlyFn(
  async (data: typeof totpCodes.$inferInsert) =>
    db.insert(totpCodes).values(data),
);

export const getTotpCode = createServerOnlyFn(async (userId: number) =>
  db.query.totpCodes.findFirst({ where: { userId } }),
);

export const deleteTotpCode = createServerOnlyFn(async (id: string) =>
  db.delete(totpCodes).where(eq(totpCodes.id, id)),
);

export const deleteTotpCodes = createServerOnlyFn(async (userId: number) =>
  db.delete(totpCodes).where(eq(totpCodes.userId, userId)),
);

export const updateTotpCode = createServerOnlyFn(
  async (data: Partial<typeof totpCodes.$inferInsert> & { id: string }) => {
    const { id, ...rest } = data;
    return db.update(totpCodes).set(rest).where(eq(totpCodes.id, id));
  },
);
