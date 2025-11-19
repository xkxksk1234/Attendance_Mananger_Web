import { Router } from 'express';
import {
  listAttendanceRecords,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord
} from './attendance.controller.js';

export const attendanceRouter = Router({ mergeParams: true });

attendanceRouter.get('/', listAttendanceRecords);
attendanceRouter.post('/', createAttendanceRecord);
attendanceRouter.put('/:recordId', updateAttendanceRecord);
attendanceRouter.delete('/:recordId', deleteAttendanceRecord);
