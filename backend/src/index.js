import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret';

app.use(cors());
app.use(express.json());

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
    { expiresIn: '2h' }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: '서버 내부 에러가 발생했습니다.' });
});

app.listen(PORT, () => {
  console.log(`Attendance Manager backend listening on port ${PORT}`);
});
