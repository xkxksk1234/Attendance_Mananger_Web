import { attendanceService } from './attendance.service.js';
import { storeService } from '../stores/store.service.js';

const parseId = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const ensureStoreAccess = async (req, res, storeId) => {
  const store = await storeService.ensureStoreAccess(req.auth.sub, storeId);

  if (!store) {
    res.status(404).json({ message: '매장을 찾을 수 없습니다.' });
    return null;
  }

  return store;
};

export const listAttendanceRecords = async (req, res, next) => {
  try {
    const storeId = parseId(req.params.storeId);
    const employeeId = parseId(req.query.employeeId);

    if (!storeId || !employeeId) {
      return res.status(400).json({ message: '근태 기록을 조회할 매장과 직원 ID가 필요합니다.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    const records = await attendanceService.listRecords(storeId, employeeId);
    return res.json({ records });
  } catch (error) {
    return next(error);
  }
};

export const createAttendanceRecord = async (req, res, next) => {
  try {
    const storeId = parseId(req.params.storeId);
    const employeeId = parseId(req.body?.employeeId);

    if (!storeId || !employeeId) {
      return res.status(400).json({ message: '근태 기록을 저장할 매장과 직원 ID가 필요합니다.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    if (!req.body?.date || !req.body?.status) {
      return res.status(400).json({ message: '근무일과 근무 유형을 입력해 주세요.' });
    }

    const record = await attendanceService.createRecord(storeId, employeeId, req.body);
    return res.status(201).json({ record });
  } catch (error) {
    return next(error);
  }
};

export const updateAttendanceRecord = async (req, res, next) => {
  try {
    const storeId = parseId(req.params.storeId);
    const recordId = parseId(req.params.recordId);

    if (!storeId || !recordId) {
      return res.status(400).json({ message: '근태 기록을 수정할 수 없습니다. 식별자를 확인하세요.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    const record = await attendanceService.updateRecord(storeId, recordId, req.body);

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
    const storeId = parseId(req.params.storeId);
    const recordId = parseId(req.params.recordId);

    if (!storeId || !recordId) {
      return res.status(400).json({ message: '근태 기록을 삭제할 수 없습니다. 식별자를 확인하세요.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    const removed = await attendanceService.deleteRecord(storeId, recordId);

    if (!removed) {
      return res.status(404).json({ message: '삭제할 근태 기록을 찾을 수 없습니다.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
