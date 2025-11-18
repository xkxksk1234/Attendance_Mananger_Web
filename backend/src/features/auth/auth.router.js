import { Router } from 'express';
import { login, logout, getSession, registerAccount, deleteAccount } from './auth.controller.js';
import { authenticateRequest } from './auth.middleware.js';

const router = Router();

router.post('/login', login);
router.post('/register', registerAccount);
router.get('/session', authenticateRequest, getSession);
router.delete('/account', authenticateRequest, deleteAccount);
router.post('/logout', logout);

export { router as authRouter };
