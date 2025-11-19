import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/stores';

export const attendanceApi = {
  async fetchRecords(storeId, employeeId) {
    if (!storeId || !employeeId) {
      return [];
    }

    const { data } = await httpClient.get(
      `${basePath}/${storeId}/attendance`,
      { params: { employeeId } }
    );
    return data.records ?? [];
  },

  async createRecord(storeId, payload) {
    const { data } = await httpClient.post(`${basePath}/${storeId}/attendance`, payload);
    return data.record;
  },

  async updateRecord(storeId, recordId, payload) {
    const { data } = await httpClient.put(
      `${basePath}/${storeId}/attendance/${recordId}`,
      payload
    );
    return data.record;
  },

  async deleteRecord(storeId, recordId) {
    await httpClient.delete(`${basePath}/${storeId}/attendance/${recordId}`);
    return true;
  }
};
