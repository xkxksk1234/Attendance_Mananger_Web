import { authService } from './auth.service.js';
import { env } from '../../config/env.js';

export const authenticateRequest = (req, res, next) => {
  const tokenFromCookie = req.cookies?.[env.tokenCookieName];
  const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: '인증 정보가 없습니다.' });
  }

  try {
    const payload = authService.verifySession(token);
    req.auth = payload;
    return next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: '세션이 만료되었거나 올바르지 않습니다.' });
  }
};
