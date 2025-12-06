import { db } from '../../config/database.js';

const VALID_ROLES = ['owner', 'admin', 'user'];
const DEFAULT_ROLE = 'user';

const mapUserRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    accountId: row.account_id,
    role: row.role,
    passwordHash: row.password_hash,
    passwordSalt: row.password_salt,
    passwordSuffix: row.password_suffix
  };
};

export const userRepository = {
  async findByAccountId(accountId) {
    if (!accountId) {
      return null;
    }

    const rows = await db.query(
      `SELECT id, name, account_id, role, password_hash, password_salt, password_suffix
       FROM users
       WHERE LOWER(account_id) = LOWER(?)
       LIMIT 1`,
      [accountId]
    );

    return mapUserRow(rows[0]);
  },

  async findById(id) {
    if (!id) {
      return null;
    }

    const rows = await db.query(
      `SELECT id, name, account_id, role, password_hash, password_salt, password_suffix
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return mapUserRow(rows[0]);
  },

  async create(userInput) {
    const normalizedRole =
      typeof userInput.role === 'string' && VALID_ROLES.includes(userInput.role)
        ? userInput.role
        : DEFAULT_ROLE;

    const [result] = await db.pool.execute(
      `INSERT INTO users (
         name,
         account_id,
         password_hash,
         password_salt,
         password_suffix,
         role
       ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userInput.name,
        userInput.accountId,
        userInput.passwordHash,
        userInput.passwordSalt,
        userInput.passwordSuffix,
        normalizedRole
      ]
    );

    return this.findById(result.insertId);
  },

  async deleteById(id) {
    if (!id) {
      return false;
    }

    const [result] = await db.pool.execute(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    return result.affectedRows > 0;
  }
};
