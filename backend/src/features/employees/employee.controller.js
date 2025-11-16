import { employeeService } from './employee.service.js';

const parseWorkspaceId = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const listEmployees = async (req, res, next) => {
  try {
    const workspaceId = parseWorkspaceId(req.params.workspaceId);

    if (!workspaceId) {
      return res.status(400).json({ message: '유효한 워크스페이스 ID가 필요합니다.' });
    }

    const employees = await employeeService.listEmployees(workspaceId);
    return res.json({ employees });
  } catch (error) {
    return next(error);
  }
};

export const createEmployee = async (req, res, next) => {
  try {
    const workspaceId = parseWorkspaceId(req.params.workspaceId);

    if (!workspaceId) {
      return res.status(400).json({ message: '유효한 워크스페이스 ID가 필요합니다.' });
    }

    const requiredFields = ['emp_id', 'name', 'role', 'phone', 'pay', 'contract_date', 'expiration_date'];
    const missing = requiredFields.filter((field) => !req.body?.[field]);

    if (missing.length) {
      return res.status(400).json({ message: '필수 입력 항목을 모두 채워주세요.' });
    }

    const employee = await employeeService.createEmployee(workspaceId, req.body);
    return res.status(201).json({ employee });
  } catch (error) {
    return next(error);
  }
};

export const updateEmployee = async (req, res, next) => {
  try {
    const workspaceId = parseWorkspaceId(req.params.workspaceId);
    const employeeId = Number(req.params.employeeId);

    if (!workspaceId || !employeeId) {
      return res.status(400).json({ message: '유효한 식별자를 전달해 주세요.' });
    }

    const employee = await employeeService.updateEmployee(workspaceId, employeeId, req.body);

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
    const workspaceId = parseWorkspaceId(req.params.workspaceId);
    const employeeId = Number(req.params.employeeId);

    if (!workspaceId || !employeeId) {
      return res.status(400).json({ message: '유효한 식별자를 전달해 주세요.' });
    }

    const removed = await employeeService.deleteEmployee(workspaceId, employeeId);

    if (!removed) {
      return res.status(404).json({ message: '삭제할 직원을 찾을 수 없습니다.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
