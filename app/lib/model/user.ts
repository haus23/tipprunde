export type Role = "USER" | "MANAGER" | "ADMIN";

export type User = {
  id: number;
  name: string;
  slug: string;
  email: string | null;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type InsertableUser = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UpdatableUser = Omit<User, "createdAt" | "updatedAt">;
