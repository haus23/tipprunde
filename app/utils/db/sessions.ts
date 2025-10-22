import { db } from "./_db.server";

/**
 * Creates a server/db session
 *
 * @param userId - Id of the user
 * @param expires - Expiration date
 * @param rememberMe - True if the user wants to stay logged in forever
 */
export async function createSession(
  userId: number,
  expires: Date,
  rememberMe: boolean,
) {
  return await db.session.create({ data: { userId, expires, rememberMe } });
}

/**
 * Loads a server/db session
 *
 * @param id - Id of the requested session
 */
export async function getSession(id: string) {
  return await db.session.findFirst({ where: { id } });
}

/**
 * Deletes a server/db session
 *
 * @param id - Id of the session
 */
export async function deleteSession(id: string) {
  await db.session.delete({ where: { id } });
}
