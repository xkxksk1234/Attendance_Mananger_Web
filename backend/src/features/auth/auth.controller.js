import { authService } from './auth.service.js';
import { sessionCookieOptions, clearSessionCookieOptions } from '../../config/cookies.js';
import { env } from '../../config/env.js';

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
    }

    const user = await authService.authenticate(email, password);

    if (!user) {
      return res.status(401).json({ message: '이메일 혹은 비밀번호가 올바르지 않습니다.' });
    }

    const token = authService.createSessionToken(user);

    res.cookie(env.tokenCookieName, token, sessionCookieOptions);

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.auth.sub);

    if (!user) {
      return res.status(401).json({ message: '세션이 올바르지 않습니다.' });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const logout = async (_req, res, next) => {
  try {
    res.clearCookie(env.tokenCookieName, clearSessionCookieOptions);
    return res.json({ message: '로그아웃되었습니다.' });
  } catch (error) {
    return next(error);
  }
};
