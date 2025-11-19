import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './config/cors.js';
import { registerRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error-handler.js';
import { notFoundHandler } from './middleware/not-found.js';

export const createApp = () => {
  const app = express();

  app.use(corsMiddleware);
  app.use(express.json());
  app.use(cookieParser());

  registerRoutes(app);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
