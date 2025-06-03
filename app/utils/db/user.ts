import type { UserInsert } from '~/database/types';

import { asc, eq } from 'drizzle-orm';

import app from '~/app';
import { users } from '~/database/schema';
import { env } from '~/utils/env.server';

const rootUser = {
  id: 0,
  email: env.ROOT_EMAIL,
  name: 'Root',
  roles: 'ROOT ADMIN',
};

/**
 * Creates a new user.
 *
 * @param user - The user data to insert. Must conform to the structure defined by `users.$inferInsert`.
 * @return A promise that resolves when the operation is completed.
 */
export async function createUser(user: UserInsert) {
  const { db } = app;
  return db.insert(users).values(user);
}

/**
 * Updates a user's information in the database.
 *
 * @param id - The user id - primary key
 * @param user - The user object containing updated information. The `id` property is used to locate the user in the database.
 * @return A promise that resolves to the result of the database update operation.
 */
export async function updateUser(id: number, user: UserInsert) {
  const { db } = app;
  return db.update(users).set(user).where(eq(users.id, id));
}

/**
 * Creates a new user or updates an existing user based on the provided data.
 * If a conflict occurs on the `slug` field, the existing record will be updated with the new data.
 * This method is mainly used for syncing the legacy users
 *
 * @param props - The user data to insert or update. Must conform to the structure defined by `users.$inferInsert`.
 * @return A promise that resolves when the operation is completed.
 */
export async function createOrUpdateLegacyUser(props: UserInsert) {
  const { db } = app;
  return db.insert(users).values(props).onConflictDoUpdate({
    target: users.slug,
    set: props,
  });
}

export async function getUsers() {
  const { db } = app;
  return db.query.users.findMany({ orderBy: [asc(users.name)] });
}

export async function getUser(id: number) {
  if (id === 0) {
    return rootUser;
  }

  const { db } = app;
  return db.query.users.findFirst({
    where: (u, { eq }) => eq(u.id, id),
  });
}

export async function getUserByEmail(email: string) {
  const { db } = app;
  const user = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });

  if (!user && email === env.ROOT_EMAIL) {
    return rootUser;
  }
  return user;
}

export async function getUsersCount() {
  const { db } = app;
  return db.$count(users);
}
