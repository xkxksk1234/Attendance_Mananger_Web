import bcrypt from 'bcryptjs';

const seededUsers = Object.freeze(
  [
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
  ].map((user) => Object.freeze(user))
);

const normalizeEmail = (email) => email.trim().toLowerCase();

export const userRepository = {
  async findByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    return (
      seededUsers.find((user) => user.email.toLowerCase() === normalizedEmail) || null
    );
  },

  async findById(id) {
    return seededUsers.find((user) => user.id === Number(id)) || null;
  }
};
