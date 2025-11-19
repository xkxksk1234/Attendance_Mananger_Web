import { authService } from './auth.service.js';
import { sessionCookieOptions, clearSessionCookieOptions } from '../../config/cookies.js';
import { env } from '../../config/env.js';
import { isValidSignupCode } from './signup-codes.js';

const ACCOUNT_ID_REGEX = /^[a-zA-Z0-9]{4,32}$/;
const PASSWORD_REGEX = /^[a-zA-Z0-9!@#$%^&*_\-+=?]{8,64}$/;
const PASSWORD_SPECIALS_LABEL = '! @ # $ % ^ & * _ - + = ?';

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  accountId: user.accountId,
  role: user.role
});

export const login = async (req, res, next) => {
  try {
    const { accountId, username, password } = req.body || {};
    const rawAccountId = accountId ?? username;
    const trimmedAccountId = rawAccountId?.trim();

    if (!trimmedAccountId || !password) {
      return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
    }

    if (!ACCOUNT_ID_REGEX.test(trimmedAccountId)) {
      return res.status(400).json({ message: '아이디는 영문/숫자 조합 4~32자로 입력해주세요.' });
    }

    const user = await authService.authenticate(trimmedAccountId, password);

    if (!user) {
      return res.status(401).json({ message: '아이디 혹은 비밀번호가 올바르지 않습니다.' });
    }

    const token = authService.createSessionToken(user);

    res.cookie(env.tokenCookieName, token, sessionCookieOptions);

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const registerAccount = async (req, res, next) => {
  try {
    const { accountId, name, password, signupCode } = req.body || {};
    const trimmedAccountId = accountId?.trim();
    const trimmedName = name?.trim();

    if (!isValidSignupCode(signupCode)) {
      return res.status(403).json({ message: '유효한 가입 코드가 필요합니다.' });
    }

    if (!trimmedAccountId || !ACCOUNT_ID_REGEX.test(trimmedAccountId)) {
      return res
        .status(400)
        .json({ message: '아이디는 영문/숫자 조합 4~32자로 입력해주세요.' });
    }

    if (!trimmedName || trimmedName.length < 2) {
      return res.status(400).json({ message: '이름을 두 글자 이상 입력해주세요.' });
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        message: `비밀번호는 8~64자의 영문, 숫자, (${PASSWORD_SPECIALS_LABEL})만 사용할 수 있습니다.`
      });
    }

    const user = await authService.registerAccount({
      accountId: trimmedAccountId,
      name: trimmedName,
      password
    });

    const token = authService.createSessionToken(user);
    res.cookie(env.tokenCookieName, token, sessionCookieOptions);

    return res.status(201).json({ user: sanitizeUser(user) });
  } catch (error) {
    const status = error.statusCode ?? 500;
    if (status !== 500) {
      return res.status(status).json({ message: error.message });
    }
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

export const deleteAccount = async (req, res, next) => {
  try {
    const { password, confirmAccountId } = req.body || {};

    if (!password || !confirmAccountId) {
      return res.status(400).json({ message: '비밀번호와 확인용 아이디를 모두 입력해주세요.' });
    }

    const user = await authService.verifyPassword(req.auth.sub, password);

    if (!user) {
      return res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
    }

    if (user.accountId !== confirmAccountId.trim()) {
      return res.status(400).json({ message: '아이디 확인 값이 일치하지 않습니다.' });
    }

    await authService.deleteAccount(user.id);

    res.clearCookie(env.tokenCookieName, clearSessionCookieOptions);

    return res.json({ message: '계정이 삭제되었습니다.' });
  } catch (error) {
    return next(error);
  }
};
