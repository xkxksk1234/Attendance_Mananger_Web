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

const formatTimeValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 5);
  }

  if (value instanceof Date) {
    return value.toISOString().slice(11, 16);
  }

  return String(value).slice(0, 5);
};

const mapRecord = (row) => ({
  id: Number(row.id),
  workspaceId: row.workspace_id,
  employeeId: Number(row.employee_id),
  date: formatDateValue(row.date),
  checkIn: formatTimeValue(row.check_in),
  checkOut: formatTimeValue(row.check_out),
  breakMinutes: Number(row.break_minutes ?? 0),
  status: row.status,
  memo: row.memo ?? '',
  totalMinutes: Number(row.total_minutes ?? 0)
});

export const attendanceRepository = {
  async findByEmployee(workspaceId, employeeId) {
    if (!workspaceId || !employeeId) {
      return [];
    }

    const rows = await db.query(
      `SELECT *
       FROM attendance_records
       WHERE workspace_id = ? AND employee_id = ?
       ORDER BY date DESC, id DESC`,
      [workspaceId, employeeId]
    );

    return rows.map(mapRecord);
  },

  async findById(workspaceId, recordId) {
    if (!workspaceId || !recordId) {
      return null;
    }

    const rows = await db.query(
      `SELECT *
       FROM attendance_records
       WHERE workspace_id = ? AND id = ?
       LIMIT 1`,
      [workspaceId, recordId]
    );

    return rows.length ? mapRecord(rows[0]) : null;
  },

  async create(workspaceId, employeeId, payload) {
    const [result] = await db.pool.execute(
      `INSERT INTO attendance_records (
         workspace_id,
         employee_id,
         date,
         check_in,
         check_out,
         break_minutes,
         status,
         memo,
         total_minutes
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        workspaceId,
        employeeId,
        payload.date,
        payload.checkIn || null,
        payload.checkOut || null,
        payload.breakMinutes ?? 0,
        payload.status,
        payload.memo || null,
        payload.totalMinutes ?? 0
      ]
    );

    return this.findById(workspaceId, result.insertId);
  },

  async update(workspaceId, recordId, payload) {
    const [result] = await db.pool.execute(
      `UPDATE attendance_records
       SET date = ?,
           check_in = ?,
           check_out = ?,
           break_minutes = ?,
           status = ?,
           memo = ?,
           total_minutes = ?
       WHERE workspace_id = ? AND id = ?`,
      [
        payload.date,
        payload.checkIn || null,
        payload.checkOut || null,
        payload.breakMinutes ?? 0,
        payload.status,
        payload.memo || null,
        payload.totalMinutes ?? 0,
        workspaceId,
        recordId
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(workspaceId, recordId);
  },

  async delete(workspaceId, recordId) {
    const [result] = await db.pool.execute(
      `DELETE FROM attendance_records
       WHERE workspace_id = ? AND id = ?`,
      [workspaceId, recordId]
    );

    return result.affectedRows > 0;
  }
};
