import { attendanceRepository } from './attendance.repository.js';

const isAbsenceStatus = (status) => ['absence', 'holiday'].includes(status);

const parseDateTime = (date, time) => {
  if (!date || !time) {
    return null;
  }

  return new Date(`${date}T${time}`);
};

const calculateTotalMinutes = ({ date, checkIn, checkOut, breakMinutes = 0, status }) => {
  if (isAbsenceStatus(status) || !checkIn || !checkOut) {
    return 0;
  }

  const start = parseDateTime(date, checkIn);
  let end = parseDateTime(date, checkOut);

  if (!start || !end) {
    return 0;
  }

  if (end <= start) {
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }

  const diffMinutes = Math.max(0, Math.round((end - start) / 60000));
  return Math.max(0, diffMinutes - Number(breakMinutes || 0));
};

const normalizePayload = (input) => ({
  date: input.date,
  checkIn: input.checkIn || null,
  checkOut: input.checkOut || null,
  breakMinutes: Number(input.breakMinutes || 0),
  status: input.status,
  memo: typeof input.memo === 'string' ? input.memo.trim() : ''
});

export const attendanceService = {
  async listRecords(workspaceId, employeeId) {
    return attendanceRepository.findByEmployee(workspaceId, employeeId);
  },

  async createRecord(workspaceId, employeeId, input) {
    const payload = normalizePayload(input);
    const totalMinutes = calculateTotalMinutes({ ...payload });
    return attendanceRepository.create(workspaceId, employeeId, { ...payload, totalMinutes });
  },

  async updateRecord(workspaceId, recordId, input) {
    const payload = normalizePayload(input);
    const totalMinutes = calculateTotalMinutes({ ...payload });
    return attendanceRepository.update(workspaceId, recordId, { ...payload, totalMinutes });
  },

  async deleteRecord(workspaceId, recordId) {
    return attendanceRepository.delete(workspaceId, recordId);
  }
};
