import { Router } from 'express';
import { login, logout, getSession } from './auth.controller.js';
import { authenticateRequest } from './auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/session', authenticateRequest, getSession);
router.post('/logout', logout);

export { router as authRouter };
