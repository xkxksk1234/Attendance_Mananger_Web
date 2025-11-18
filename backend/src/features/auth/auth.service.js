import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
import { userRepository } from './user.repository.js';
import { passwordManager } from './password.service.js';

const sessionExpiresInSeconds = Math.max(1, Math.floor(env.sessionTtlMs / 1000));

export const authService = {
  async authenticate(accountId, password) {
    const user = await userRepository.findByAccountId(accountId);

    if (!user) {
      return null;
    }

    const isPasswordValid = passwordManager.verifyPassword(password, user);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  },

  createSessionToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        accountId: user.accountId,
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
  },

  async registerAccount({ accountId, name, password }) {
    const existing = await userRepository.findByAccountId(accountId);

    if (existing) {
      const error = new Error('이미 사용 중인 아이디입니다.');
      error.statusCode = 409;
      throw error;
    }

    const passwordArtifacts = passwordManager.createPasswordArtifacts(password);

    return userRepository.create({
      accountId,
      name,
      ...passwordArtifacts,
      role: 'admin'
    });
  },

  async deleteAccount(userId) {
    return userRepository.deleteById(userId);
  },

  async verifyPassword(userId, password) {
    const user = await this.getUserById(userId);

    if (!user) {
      return null;
    }

    const isValid = passwordManager.verifyPassword(password, user);
    return isValid ? user : null;
  }
};
