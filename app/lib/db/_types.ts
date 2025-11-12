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

export type Session = {
  id: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export type Verification = {
  userId: number;
  identifier: string;
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
  charSet: string;
  expiresAt: string;
  attempts: number;
  createdAt: string;
  updatedAt: string;
};
