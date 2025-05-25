import app from '~/app';
import { users } from '~/database/schema';
import { env } from '~/utils/env.server';

const rootUser = {
  id: 0,
  email: env.ROOT_EMAIL,
  name: 'Root',
  roles: 'ROOT ADMIN',
};

export async function createOrUpdateUser(props: typeof users.$inferInsert) {
  const { db } = app;
  return db.insert(users).values(props).onConflictDoUpdate({
    target: users.slug,
    set: props,
  });
}

export async function getUsers() {
  const { db } = app;
  return db.query.users.findMany();
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

export async function getUserCount() {
  const { db } = app;
  return db.$count(users);
}
