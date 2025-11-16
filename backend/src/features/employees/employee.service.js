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
  async listEmployees(storeId) {
    return employeeRepository.findByStore(storeId);
  },

  async createEmployee(storeId, input) {
    const payload = normalizeEmployeePayload(input);
    return employeeRepository.create(storeId, payload);
  },

  async updateEmployee(storeId, employeeId, input) {
    const payload = normalizeEmployeePayload(input);
    return employeeRepository.update(storeId, employeeId, payload);
  },

  async deleteEmployee(storeId, employeeId) {
    return employeeRepository.delete(storeId, employeeId);
  }
};
