import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/stores';

export const employeeApi = {
  async fetchEmployees(storeId) {
    if (!storeId) {
      return [];
    }

    const { data } = await httpClient.get(`${basePath}/${storeId}/employees`);
    return data.employees ?? [];
  },

  async createEmployee(storeId, payload) {
    const { data } = await httpClient.post(`${basePath}/${storeId}/employees`, payload);
    return data.employee;
  },

  async updateEmployee(storeId, employeeId, payload) {
    const { data } = await httpClient.put(
      `${basePath}/${storeId}/employees/${employeeId}`,
      payload
    );
    return data.employee;
  },

  async deleteEmployee(storeId, employeeId) {
    await httpClient.delete(`${basePath}/${storeId}/employees/${employeeId}`);
    return true;
  }
};
