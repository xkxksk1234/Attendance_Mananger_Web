import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = CORS_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const TOKEN_COOKIE_NAME = 'attendance_token';
const cookieBaseOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: 2 * 60 * 60 * 1000 // 2 hours
};

app.use(
  cors({
    origin:
      allowedOrigins.length === 0
        ? undefined
        : allowedOrigins.length === 1
          ? allowedOrigins[0]
          : allowedOrigins,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

const users = [
  {
    id: 1,
    name: '관리자',
    email: 'admin@example.com',
    role: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10)
  },
  {
    id: 2,
    name: '홍길동',
    email: 'hong@example.com',
    role: 'employee',
    passwordHash: bcrypt.hashSync('password123', 10)
  }
];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const authenticateToken = (req, res, next) => {
  const tokenFromCookie = req.cookies?.[TOKEN_COOKIE_NAME];
  const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;

  const token = tokenFromCookie || tokenFromHeader;

  if (!token) {
    return res.status(401).json({ message: '인증 정보가 없습니다.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.auth = payload;
    next();
  } catch (verificationError) {
    console.error('JWT verification failed:', verificationError);
    return res.status(401).json({ message: '세션이 만료되었거나 올바르지 않습니다.' });
  }
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요.' });
  }

  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    return res.status(401).json({ message: '이메일 혹은 비밀번호가 올바르지 않습니다.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: '이메일 혹은 비밀번호가 올바르지 않습니다.' });
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: cookieBaseOptions.maxAge / 1000 }
  );

  res.cookie(TOKEN_COOKIE_NAME, token, cookieBaseOptions);

  return res.json({
    user: sanitizeUser(user)
  });
});

app.get('/api/session', authenticateToken, (req, res) => {
  const user = users.find((candidate) => candidate.id === req.auth.sub);

  if (!user) {
    return res.status(401).json({ message: '세션이 올바르지 않습니다.' });
  }

  return res.json({ user: sanitizeUser(user) });
});

app.post('/api/logout', (_req, res) => {
  res.clearCookie(TOKEN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });
  return res.json({ message: '로그아웃되었습니다.' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: '서버 내부 에러가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`Attendance Manager backend listening on port ${PORT}`);
});
