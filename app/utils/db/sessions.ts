import { db } from "./_db.server";

export async function createSession(
  userId: number,
  expires: Date,
  rememberMe: boolean,
) {
  return await db.session.create({ data: { userId, expires, rememberMe } });
}
