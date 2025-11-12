import dotenv from 'dotenv';

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizeSameSite = (value) => {
  const normalized = (value || 'lax').toLowerCase();
  return ['lax', 'strict', 'none'].includes(normalized) ? normalized : 'lax';
};

const rawCorsOrigins = process.env.CORS_ORIGIN || 'http://localhost:5173';
const corsAllowedOrigins = Array.from(
  new Set(
    rawCorsOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  )
);

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const port = toNumber(process.env.PORT, 4000);
const sessionTtlHours = toNumber(process.env.SESSION_TTL_HOURS, 2);

export const env = {
  nodeEnv,
  isProduction,
  port,
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  corsAllowedOrigins,
  rawCorsOrigins,
  tokenCookieName: process.env.TOKEN_COOKIE_NAME || 'attendance_token',
  sessionTtlMs: sessionTtlHours * 60 * 60 * 1000,
  cookieSameSite: normalizeSameSite(process.env.COOKIE_SAME_SITE)
};
