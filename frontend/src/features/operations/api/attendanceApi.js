import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/workspaces';

export const attendanceApi = {
  async fetchRecords(workspaceId, employeeId) {
    if (!workspaceId || !employeeId) {
      return [];
    }

    const { data } = await httpClient.get(
      `${basePath}/${workspaceId}/attendance`,
      { params: { employeeId } }
    );
    return data.records ?? [];
  },

  async createRecord(workspaceId, payload) {
    const { data } = await httpClient.post(`${basePath}/${workspaceId}/attendance`, payload);
    return data.record;
  },

  async updateRecord(workspaceId, recordId, payload) {
    const { data } = await httpClient.put(
      `${basePath}/${workspaceId}/attendance/${recordId}`,
      payload
    );
    return data.record;
  },

  async deleteRecord(workspaceId, recordId) {
    await httpClient.delete(`${basePath}/${workspaceId}/attendance/${recordId}`);
    return true;
  }
};
