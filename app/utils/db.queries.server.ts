/*
 * Reusable db helper queries
 */

import { env } from '~/utils/env.server';

const rootUser = {
  id: 0,
  email: env.ROOT_EMAIL,
  name: 'Root',
  roles: 'ROOT ADMIN MANAGER',
};

/**
 * Gets user by id
 *
 * @param id
 * @returns User or null
 */
export async function getUserById(id: number) {
  if (id === 0) {
    return rootUser;
  }

  return null;
}

/**
 * Gets user by email address
 *
 * @param email Known email address
 * @returns User or null if email address is unknown
 */
export async function getUserByEmail(email: string) {
  if (email === env.ROOT_EMAIL) {
    return rootUser;
  }

  return null;
}
