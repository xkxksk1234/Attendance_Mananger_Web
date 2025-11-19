import crypto from 'crypto';

const HASH_LENGTH = 64; // 64 bytes => 128 char hex string
const SALT_BYTES = 16;
const SUFFIX_LENGTH = 8;

const buildBufferFromHex = (hexString = '') => {
  if (!hexString) {
    return null;
  }

  return Buffer.from(hexString, 'hex');
};

const generateSuffix = () => {
  const raw = crypto.randomBytes(SUFFIX_LENGTH * 2).toString('base64');
  return raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, SUFFIX_LENGTH);
};

const deriveHash = (secret, saltBuffer) => {
  return crypto.scryptSync(secret, saltBuffer, HASH_LENGTH).toString('hex');
};

export const passwordManager = {
  createPasswordArtifacts(password) {
    if (!password) {
      throw new Error('비밀번호가 필요합니다.');
    }

    const suffix = generateSuffix();
    const salt = crypto.randomBytes(SALT_BYTES).toString('hex');
    const hash = deriveHash(`${password}${suffix}`, buildBufferFromHex(salt));

    return {
      passwordHash: hash,
      passwordSalt: salt,
      passwordSuffix: suffix
    };
  },

  verifyPassword(password, user) {
    if (!user || !user.passwordHash || !user.passwordSalt) {
      return false;
    }

    const suffix = user.passwordSuffix ?? '';
    const saltBuffer = buildBufferFromHex(user.passwordSalt);

    if (!saltBuffer) {
      return false;
    }

    const candidateHash = deriveHash(`${password}${suffix}`, saltBuffer);

    try {
      return crypto.timingSafeEqual(
        Buffer.from(candidateHash, 'hex'),
        Buffer.from(user.passwordHash, 'hex')
      );
    } catch (error) {
      return false;
    }
  }
};
