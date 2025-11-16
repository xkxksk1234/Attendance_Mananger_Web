import { db } from '../../config/database.js';

const runQuery = async (connection, sql, params = []) => {
  if (connection) {
    const [rows] = await connection.execute(sql, params);
    return rows;
  }

  return db.query(sql, params);
};

const mapWorkspace = (row, roles = []) => ({
  id: row.id,
  name: row.name,
  industry: row.industry,
  underFive: Boolean(row.underFive),
  roles
});

const fetchRolesForWorkspaceIds = async (workspaceIds, connection) => {
  const roleMap = new Map();

  if (!workspaceIds.length) {
    return roleMap;
  }

  const placeholders = workspaceIds.map(() => '?').join(', ');
  const rows = await runQuery(
    connection,
    `SELECT workspace_id AS workspaceId, role_name AS roleName
     FROM workspace_roles
     WHERE workspace_id IN (${placeholders})
     ORDER BY display_order ASC, id ASC`,
    workspaceIds
  );

  rows.forEach((row) => {
    const current = roleMap.get(row.workspaceId) ?? [];
    current.push(row.roleName);
    roleMap.set(row.workspaceId, current);
  });

  return roleMap;
};

export const workspaceRepository = {
  async findAll() {
    const rows = await db.query(
      `SELECT id, name, industry, under_five AS underFive
       FROM workspaces
       ORDER BY created_at ASC`
    );

    const roleMap = await fetchRolesForWorkspaceIds(rows.map((row) => row.id));

    return rows.map((row) => mapWorkspace(row, roleMap.get(row.id) ?? []));
  },

  async findById(id, options = {}) {
    if (!id) {
      return null;
    }

    const rows = await runQuery(
      options.connection,
      `SELECT id, name, industry, under_five AS underFive
       FROM workspaces
       WHERE id = ?
       LIMIT 1`,
      [id]
    );

    if (!rows.length) {
      return null;
    }

    const workspace = rows[0];
    let roles = [];

    if (options.includeRoles !== false) {
      const roleMap = await fetchRolesForWorkspaceIds([workspace.id], options.connection);
      roles = roleMap.get(workspace.id) ?? [];
    }

    return mapWorkspace(workspace, roles);
  },

  async create(workspaceInput, roles) {
    return db.transaction(async (connection) => {
      const [result] = await connection.execute(
        `INSERT INTO workspaces (name, industry, under_five)
         VALUES (?, ?, ?)`,
        [workspaceInput.name, workspaceInput.industry, workspaceInput.underFive ? 1 : 0]
      );

      const workspaceId = result.insertId;

      for (let index = 0; index < roles.length; index += 1) {
        const roleName = roles[index];
        await connection.execute(
          `INSERT INTO workspace_roles (workspace_id, role_name, display_order)
           VALUES (?, ?, ?)`,
          [workspaceId, roleName, index]
        );
      }

      return this.findById(workspaceId, { connection });
    });
  }
};
