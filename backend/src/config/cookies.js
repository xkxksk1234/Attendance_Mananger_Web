import { env } from './env.js';

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: env.cookieSameSite,
  secure: env.isProduction,
  path: '/',
  maxAge: env.sessionTtlMs
};

export const clearSessionCookieOptions = {
  httpOnly: true,
  sameSite: env.cookieSameSite,
  secure: env.isProduction,
  path: '/'
};
