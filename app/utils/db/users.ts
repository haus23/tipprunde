import type { Prisma } from "../prisma/client";
import { db } from "./_db.server";

export type User = Prisma.Result<
  typeof db.user,
  Prisma.UserFindFirstArgs,
  "findFirst"
>;

/**
 * Loads user by its email address
 *
 * @param email
 * @returns Found user or null
 */
export async function getUserByEmail(email: string) {
  const user = await db.user.findUnique({ where: { email } });
  return user;
}
