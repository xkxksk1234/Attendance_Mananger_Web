import { attendanceService } from './attendance.service.js';

const parseId = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const listAttendanceRecords = async (req, res, next) => {
  try {
    const workspaceId = parseId(req.params.workspaceId);
    const employeeId = parseId(req.query.employeeId);

    if (!workspaceId || !employeeId) {
      return res.status(400).json({ message: '근태 기록을 조회할 워크스페이스와 직원 ID가 필요합니다.' });
    }

    const records = await attendanceService.listRecords(workspaceId, employeeId);
    return res.json({ records });
  } catch (error) {
    return next(error);
  }
};

export const createAttendanceRecord = async (req, res, next) => {
  try {
    const workspaceId = parseId(req.params.workspaceId);
    const employeeId = parseId(req.body?.employeeId);

    if (!workspaceId || !employeeId) {
      return res.status(400).json({ message: '근태 기록을 저장할 워크스페이스와 직원 ID가 필요합니다.' });
    }

    if (!req.body?.date || !req.body?.status) {
      return res.status(400).json({ message: '근무일과 근무 유형을 입력해 주세요.' });
    }

    const record = await attendanceService.createRecord(workspaceId, employeeId, req.body);
    return res.status(201).json({ record });
  } catch (error) {
    return next(error);
  }
};

export const updateAttendanceRecord = async (req, res, next) => {
  try {
    const workspaceId = parseId(req.params.workspaceId);
    const recordId = parseId(req.params.recordId);

    if (!workspaceId || !recordId) {
      return res.status(400).json({ message: '근태 기록을 수정할 수 없습니다. 식별자를 확인하세요.' });
    }

    const record = await attendanceService.updateRecord(workspaceId, recordId, req.body);

    if (!record) {
      return res.status(404).json({ message: '수정할 근태 기록을 찾을 수 없습니다.' });
    }

    return res.json({ record });
  } catch (error) {
    return next(error);
  }
};

export const deleteAttendanceRecord = async (req, res, next) => {
  try {
    const workspaceId = parseId(req.params.workspaceId);
    const recordId = parseId(req.params.recordId);

    if (!workspaceId || !recordId) {
      return res.status(400).json({ message: '근태 기록을 삭제할 수 없습니다. 식별자를 확인하세요.' });
    }

    const removed = await attendanceService.deleteRecord(workspaceId, recordId);

    if (!removed) {
      return res.status(404).json({ message: '삭제할 근태 기록을 찾을 수 없습니다.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
