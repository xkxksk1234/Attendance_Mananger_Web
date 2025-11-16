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
  storeId: row.store_id,
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
  async findByEmployee(storeId, employeeId) {
    if (!storeId || !employeeId) {
      return [];
    }

    const rows = await db.query(
      `SELECT *
       FROM attendance_records
       WHERE store_id = ? AND employee_id = ?
       ORDER BY date DESC, id DESC`,
      [storeId, employeeId]
    );

    return rows.map(mapRecord);
  },

  async findById(storeId, recordId) {
    if (!storeId || !recordId) {
      return null;
    }

    const rows = await db.query(
      `SELECT *
       FROM attendance_records
       WHERE store_id = ? AND id = ?
       LIMIT 1`,
      [storeId, recordId]
    );

    return rows.length ? mapRecord(rows[0]) : null;
  },

  async create(storeId, employeeId, payload) {
    const [result] = await db.pool.execute(
      `INSERT INTO attendance_records (
         store_id,
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
        storeId,
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

    return this.findById(storeId, result.insertId);
  },

  async update(storeId, recordId, payload) {
    const [result] = await db.pool.execute(
      `UPDATE attendance_records
       SET date = ?,
           check_in = ?,
           check_out = ?,
           break_minutes = ?,
           status = ?,
           memo = ?,
           total_minutes = ?
       WHERE store_id = ? AND id = ?`,
      [
        payload.date,
        payload.checkIn || null,
        payload.checkOut || null,
        payload.breakMinutes ?? 0,
        payload.status,
        payload.memo || null,
        payload.totalMinutes ?? 0,
        storeId,
        recordId
      ]
    );

    if (result.affectedRows === 0) {
      return null;
    }

    return this.findById(storeId, recordId);
  },

  async delete(storeId, recordId) {
    const [result] = await db.pool.execute(
      `DELETE FROM attendance_records
       WHERE store_id = ? AND id = ?`,
      [storeId, recordId]
    );

    return result.affectedRows > 0;
  }
};
