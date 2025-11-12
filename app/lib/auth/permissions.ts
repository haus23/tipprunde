import type { User } from "../db/_types";

export function isAdmin(user: User | null) {
  return user?.role === "ADMIN";
}

export function isManager(user: User | null) {
  return user?.role === "MANAGER" || user?.role === "ADMIN";
}

export function isAuthenticated(user: User | null) {
  return user !== null;
}

export function isAnonymous(user: User | null) {
  return user === null;
}
