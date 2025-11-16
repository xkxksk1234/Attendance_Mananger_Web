import { Router } from 'express';
import { authRouter } from '../features/auth/auth.router.js';
import { healthRouter } from '../features/health/health.router.js';
import { workspacesRouter } from '../features/workspaces/workspace.router.js';

export const registerRoutes = (app) => {
  const apiRouter = Router();

  apiRouter.use('/auth', authRouter);
  apiRouter.use('/health', healthRouter);
  apiRouter.use('/workspaces', workspacesRouter);

  app.use('/api', apiRouter);
};
