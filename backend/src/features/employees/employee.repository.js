import { db } from '../../config/database.js';

const formatDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
};

const mapEmployee = (row) => ({
  id: row.id,
  workspaceId: row.workspace_id,
  emp_id: Number(row.emp_id),
  name: row.name,
  rrn: row.rrn,
  role: row.role,
  phone: row.phone,
  pay: Number(row.pay),
  bank_name: row.bank_name ?? '',
  bank_account: row.bank_account ?? '',
  address: row.address ?? '',
  contract_date: formatDateValue(row.contract_date),
  expiration_date: formatDateValue(row.expiration_date),
  memo: row.memo ?? ''
});

export const employeeRepository = {
  async findByWorkspace(workspaceId) {
    if (!workspaceId) {
      return [];
    }

    const rows = await db.query(
      `SELECT *
       FROM employees
       WHERE workspace_id = ?
       ORDER BY created_at DESC, id DESC`,
      [workspaceId]
    );

    return rows.map(mapEmployee);
  },

  async findById(workspaceId, employeeId) {
    if (!workspaceId || !employeeId) {
      return null;
    }

    const rows = await db.query(
      `SELECT *
       FROM employees
       WHERE workspace_id = ? AND id = ?
       LIMIT 1`,
      [workspaceId, employeeId]
    );

    return rows.length ? mapEmployee(rows[0]) : null;
  },

  async create(workspaceId, payload) {
    const [result] = await db.pool.execute(
      `INSERT INTO employees (
         workspace_id,
         emp_id,
         name,
         rrn,
         role,
         phone,
         pay,
         bank_name,
         bank_account,
         address,
         contract_date,
         expiration_date,
         memo
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workspaceId,
        payload.emp_id,
        payload.name,
        payload.rrn || null,
        payload.role,
        payload.phone,
        payload.pay,
        payload.bank_name || null,
        payload.bank_account || null,
        payload.address || null,
        payload.contract_date,
        payload.expiration_date,
        payload.memo || null
      ]
    );

    return this.findById(workspaceId, result.insertId);
  },

  async update(workspaceId, employeeId, payload) {
    const [result] = await db.pool.execute(
      `UPDATE employees
       SET emp_id = ?,
           name = ?,
           rrn = ?,
           role = ?,
           phone = ?,
           pay = ?,
           bank_name = ?,
           bank_account = ?,
           address = ?,
           contract_date = ?,
           expiration_date = ?,
           memo = ?
       WHERE workspace_id = ? AND id = ?`,
      [
        payload.emp_id,
        payload.name,
        payload.rrn || null,
        payload.role,
        payload.phone,
        payload.pay,
        payload.bank_name || null,
        payload.bank_account || null,
        payload.address || null,
        payload.contract_date,
        payload.expiration_date,
        payload.memo || null,
        workspaceId,
        employeeId
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(workspaceId, employeeId);
  },

  async delete(workspaceId, employeeId) {
    const [result] = await db.pool.execute(
      `DELETE FROM employees WHERE workspace_id = ? AND id = ?`,
      [workspaceId, employeeId]
    );

    return result.affectedRows > 0;
  }
};
