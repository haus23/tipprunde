import { env } from "../env.server";
import type { Prisma } from "../prisma/client";
import { db } from "./_db.server";

export type User = Prisma.Result<
  typeof db.user,
  Prisma.UserFindFirstArgs,
  "findFirst"
>;

const rootUser = {
  id: 0,
  email: env.ROOT_EMAIL,
  name: "Root",
  slug: "root",
  role: "ADMIN",
  createdAt: new Date(),
  updatedAt: new Date(),
  isAdmin: true,
  isManager: true,
} satisfies User;

/**
 * Loads user by its email address
 *
 * @param email
 * @returns Found user or null
 */
export async function getUserByEmail(email: string) {
  const user = await db.user.findUnique({ where: { email } });

  if (!user && email === env.ROOT_EMAIL) {
    return rootUser;
  }

  return user;
}

/**
 * Loads user by its id
 *
 * @param id
 * @returns Found user or null
 */
export async function getUserById(id: number) {
  if (id === 0) {
    return rootUser;
  }

  const user = await db.user.findFirst({ where: { id } });
  return user;
}
