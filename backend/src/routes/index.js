import { Router } from 'express';
import { authRouter } from '../features/auth/auth.router.js';
import { healthRouter } from '../features/health/health.router.js';
import { storesRouter } from '../features/stores/store.router.js';

export const registerRoutes = (app) => {
  const apiRouter = Router();

  apiRouter.use('/auth', authRouter);
  apiRouter.use('/health', healthRouter);
  apiRouter.use('/stores', storesRouter);

  app.use('/api', apiRouter);
};
