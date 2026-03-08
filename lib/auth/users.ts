import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  return db.query.users.findFirst({
    where: { email },
  });
}
