import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../../config/env.js';
import { userRepository } from './user.repository.js';

const sessionExpiresInSeconds = Math.max(1, Math.floor(env.sessionTtlMs / 1000));

export const authService = {
  async authenticate(email, password) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  },

  createSessionToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      env.jwtSecret,
      { expiresIn: sessionExpiresInSeconds }
    );
  },

  verifySession(token) {
    return jwt.verify(token, env.jwtSecret);
  },

  async getUserById(id) {
    return userRepository.findById(id);
  }
};
