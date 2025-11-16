import { db } from '../../config/database.js';

const mapUserRow = (row) => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    passwordHash: row.password_hash
  };
};

export const userRepository = {
  async findByEmail(email) {
    if (!email) {
      return null;
    }

    const rows = await db.query(
      `SELECT id, name, email, role, password_hash
       FROM users
       WHERE LOWER(email) = LOWER(?)
       LIMIT 1`,
      [email]
    );

    return mapUserRow(rows[0]);
  },

  async findById(id) {
    if (!id) {
      return null;
    }

    const rows = await db.query(
      `SELECT id, name, email, role, password_hash
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    return mapUserRow(rows[0]);
  }
};
