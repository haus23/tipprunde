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
  // root user has no user table entry, so we use null for the userId here
  return await db.session.create({
    data: { userId: userId || null, expires, rememberMe },
  });
}

/**
 * Loads a server/db session
 *
 * @param id - Id of the requested session
 */
export async function getSession(id: string) {
  const session = await db.session.findFirst({ where: { id } });
  // root user has no user table entry, so we use null for the userId here
  if (session && session.userId === null) {
    session.userId = 0;
  }
  return session;
}

/**
 * Deletes a server/db session
 *
 * @param id - Id of the session
 */
export async function deleteSession(id: string) {
  await db.session.delete({ where: { id } });
}
