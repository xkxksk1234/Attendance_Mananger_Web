import { db } from '../../config/database.js';

const runQuery = async (connection, sql, params = []) => {
  if (connection) {
    const [rows] = await connection.execute(sql, params);
    return rows;
  }

  return db.query(sql, params);
};

const mapStore = (row, roles = []) => ({
  id: row.id,
  name: row.name,
  industry: row.industry,
  underFive: Boolean(row.underFive),
  roles
});

const fetchRolesForStoreIds = async (storeIds, connection) => {
  const roleMap = new Map();

  if (!storeIds.length) {
    return roleMap;
  }

  const placeholders = storeIds.map(() => '?').join(', ');
  const rows = await runQuery(
    connection,
    `SELECT store_id AS storeId, role_name AS roleName
     FROM store_roles
     WHERE store_id IN (${placeholders})
     ORDER BY display_order ASC, id ASC`,
    storeIds
  );

  rows.forEach((row) => {
    const current = roleMap.get(row.storeId) ?? [];
    current.push(row.roleName);
    roleMap.set(row.storeId, current);
  });

  return roleMap;
};

export const storeRepository = {
  async findAll() {
    const rows = await db.query(
      `SELECT id, name, industry, under_five AS underFive
       FROM stores
       ORDER BY created_at ASC`
    );

    const roleMap = await fetchRolesForStoreIds(rows.map((row) => row.id));

    return rows.map((row) => mapStore(row, roleMap.get(row.id) ?? []));
  },

  async findById(id, options = {}) {
    if (!id) {
      return null;
    }

    const rows = await runQuery(
      options.connection,
      `SELECT id, name, industry, under_five AS underFive
       FROM stores
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return null;
    }

    const store = rows[0];
    let roles = [];

    if (options.includeRoles !== false) {
      const roleMap = await fetchRolesForStoreIds([store.id], options.connection);
      roles = roleMap.get(store.id) ?? [];
    }

    return mapStore(store, roles);
  },

  async create(storeInput, roles) {
    return db.transaction(async (connection) => {
      const [result] = await connection.execute(
        `INSERT INTO stores (name, industry, under_five)
         VALUES (?, ?, ?)`,
        [storeInput.name, storeInput.industry, storeInput.underFive ? 1 : 0]
      );

      const storeId = result.insertId;

      for (let index = 0; index < roles.length; index += 1) {
        const roleName = roles[index];
        await connection.execute(
          `INSERT INTO store_roles (store_id, role_name, display_order)
           VALUES (?, ?, ?)`,
          [storeId, roleName, index]
        );
      }

      return this.findById(storeId, { connection });
    });
  }
};
