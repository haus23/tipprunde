export type Role = "USER" | "MANAGER" | "ADMIN";

export type User = {
  id: number;
  name: string;
  slug: string;
  email: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  user_id: number;
};

export type Verification = {
  user_id: number;
  identifier: string;
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
  char_set: string;
  expires_at: string;
  attempts: number;
  created_at: string;
  updated_at: string;
};
