export const SESSION_SECRET = String(process.env.SESSION_SECRET);
export const SESSION_DURATION_DEFAULT = Number(process.env.SESSION_DURATION_DEFAULT);
export const SESSION_DURATION_REMEMBER = Number(process.env.SESSION_DURATION_REMEMBER);

export const TOTP_EXPIRES_IN = Number(process.env.TOTP_EXPIRES_IN);
export const TOTP_MAX_ATTEMPTS = Number(process.env.TOTP_MAX_ATTEMPTS);

export const RESEND_API_KEY = String(process.env.RESEND_API_KEY);
export const FROM_EMAIL = String(process.env.FROM_EMAIL);
