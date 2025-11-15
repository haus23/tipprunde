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
