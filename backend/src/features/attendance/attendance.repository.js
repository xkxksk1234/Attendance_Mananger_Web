import { db } from '../../config/database.js';

let ensureAttendanceTablePromise = null;

const ensureAttendanceTable = async () => {
  if (!ensureAttendanceTablePromise) {
    ensureAttendanceTablePromise = db.pool
      .execute(`
        CREATE TABLE IF NOT EXISTS attendance_records (
          id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          store_id INT UNSIGNED NOT NULL,
          employee_id BIGINT UNSIGNED NOT NULL,
          date DATE NOT NULL,
          check_in TIME NULL,
          check_out TIME NULL,
          break_minutes INT UNSIGNED NOT NULL DEFAULT 0,
          status VARCHAR(50) NOT NULL,
          memo VARCHAR(255) NULL,
          total_minutes INT UNSIGNED NOT NULL DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_attendance_store_employee (store_id, employee_id),
          CONSTRAINT fk_attendance_store FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
          CONSTRAINT fk_attendance_employee FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `)
      .catch((error) => {
        ensureAttendanceTablePromise = null;
        throw error;
      });
  }

  return ensureAttendanceTablePromise;
};

const formatDateValue = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value.slice(0, 10);
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    // Normalize to the local calendar date instead of UTC to avoid "-1 day"
    // conversions when the MySQL driver materializes DATE columns using the
    // server timezone.
    const offsetMinutes = value.getTimezoneOffset();
    const normalized = new Date(value.getTime() - offsetMinutes * 60000);
    return normalized.toISOString().slice(0, 10);
  }

  return String(value).slice(0, 10);
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
  totalMinutes: Number(row.total_minutes ?? 0),
  createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null
});

export const attendanceRepository = {
  async findByEmployee(storeId, employeeId) {
    if (!storeId || !employeeId) {
      return [];
    }

    await ensureAttendanceTable();
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

    await ensureAttendanceTable();
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
    await ensureAttendanceTable();
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
    await ensureAttendanceTable();
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
    await ensureAttendanceTable();
    const [result] = await db.pool.execute(
      `DELETE FROM attendance_records
       WHERE store_id = ? AND id = ?`,
      [storeId, recordId]
    );

    return result.affectedRows > 0;
  }
};
