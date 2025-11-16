import { employeeRepository } from './employee.repository.js';

const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : '');
const toDigits = (value) => sanitizeString(value).replace(/[^0-9]/g, '');

const normalizeEmployeePayload = (input) => ({
  emp_id: Number(input.emp_id),
  name: sanitizeString(input.name),
  rrn: sanitizeString(input.rrn) || null,
  role: sanitizeString(input.role),
  phone: sanitizeString(input.phone),
  pay: Number(input.pay),
  bank_name: sanitizeString(input.bank_name) || null,
  bank_account: toDigits(input.bank_account) || null,
  address: sanitizeString(input.address) || null,
  contract_date: input.contract_date,
  expiration_date: input.expiration_date,
  memo: sanitizeString(input.memo) || null
});

export const employeeService = {
  async listEmployees(workspaceId) {
    return employeeRepository.findByWorkspace(workspaceId);
  },

  async createEmployee(workspaceId, input) {
    const payload = normalizeEmployeePayload(input);
    return employeeRepository.create(workspaceId, payload);
  },

  async updateEmployee(workspaceId, employeeId, input) {
    const payload = normalizeEmployeePayload(input);
    return employeeRepository.update(workspaceId, employeeId, payload);
  },

  async deleteEmployee(workspaceId, employeeId) {
    return employeeRepository.delete(workspaceId, employeeId);
  }
};
