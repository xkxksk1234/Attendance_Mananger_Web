import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/workspaces';

export const employeeApi = {
  async fetchEmployees(workspaceId) {
    if (!workspaceId) {
      return [];
    }

    const { data } = await httpClient.get(`${basePath}/${workspaceId}/employees`);
    return data.employees ?? [];
  },

  async createEmployee(workspaceId, payload) {
    const { data } = await httpClient.post(`${basePath}/${workspaceId}/employees`, payload);
    return data.employee;
  },

  async updateEmployee(workspaceId, employeeId, payload) {
    const { data } = await httpClient.put(
      `${basePath}/${workspaceId}/employees/${employeeId}`,
      payload
    );
    return data.employee;
  },

  async deleteEmployee(workspaceId, employeeId) {
    await httpClient.delete(`${basePath}/${workspaceId}/employees/${employeeId}`);
    return true;
  }
};
