import { employeeService } from './employee.service.js';
import { storeService } from '../stores/store.service.js';

const parseStoreId = (value) => {
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

export const listEmployees = async (req, res, next) => {
  try {
    const storeId = parseStoreId(req.params.storeId);

    if (!storeId) {
      return res.status(400).json({ message: '유효한 매장 ID가 필요합니다.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    const employees = await employeeService.listEmployees(storeId);
    return res.json({ employees });
  } catch (error) {
    return next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const storeId = parseStoreId(req.params.storeId);

    if (!storeId) {
      return res.status(400).json({ message: '유효한 매장 ID가 필요합니다.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    const requiredFields = ['emp_id', 'name', 'role', 'phone', 'pay', 'contract_date', 'expiration_date'];
    const missing = requiredFields.filter((field) => !req.body?.[field]);

    if (missing.length) {
      return res.status(400).json({ message: '필수 입력 항목을 모두 채워주세요.' });
    }

    const employee = await employeeService.createEmployee(storeId, req.body);
    return res.status(201).json({ employee });
  } catch (error) {
    return next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const storeId = parseStoreId(req.params.storeId);
    const employeeId = Number(req.params.employeeId);

    if (!storeId || !employeeId) {
      return res.status(400).json({ message: '유효한 식별자를 전달해 주세요.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    const employee = await employeeService.updateEmployee(storeId, employeeId, req.body);

    if (!employee) {
      return res.status(404).json({ message: '해당 직원을 찾을 수 없습니다.' });
    }

    return res.json({ employee });
  } catch (error) {
    return next(error);
  }
};

export const deleteEmployee = async (req, res, next) => {
  try {
    const storeId = parseStoreId(req.params.storeId);
    const employeeId = Number(req.params.employeeId);

    if (!storeId || !employeeId) {
      return res.status(400).json({ message: '유효한 식별자를 전달해 주세요.' });
    }

    const store = await ensureStoreAccess(req, res, storeId);

    if (!store) {
      return undefined;
    }

    const removed = await employeeService.deleteEmployee(storeId, employeeId);

    if (!removed) {
      return res.status(404).json({ message: '삭제할 직원을 찾을 수 없습니다.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
