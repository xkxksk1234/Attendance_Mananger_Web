import cors from 'cors';
import { env } from './env.js';

const resolveOrigin = () => {
  if (env.corsAllowedOrigins.length === 0) {
    return undefined;
  }

  if (env.corsAllowedOrigins.length === 1) {
    return env.corsAllowedOrigins[0];
  }

  return env.corsAllowedOrigins;
};

export const corsMiddleware = cors({
  origin: resolveOrigin(),
  credentials: true
});
