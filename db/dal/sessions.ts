import { createServerOnlyFn } from "@tanstack/react-start";
import { eq } from "drizzle-orm";
import { db } from "#db";
import { sessions } from "../schema/tables.ts";

export const createSession = createServerOnlyFn(async (data: typeof sessions.$inferInsert) =>
  db.insert(sessions).values(data),
);

export const getSession = createServerOnlyFn(async (id: string) =>
  db.query.sessions.findFirst({
    where: { id },
    with: { user: true },
  }),
);

export const deleteSession = createServerOnlyFn(async (id: string) =>
  db.delete(sessions).where(eq(sessions.id, id)),
);
