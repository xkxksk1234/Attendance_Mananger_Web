import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/stores';

export const attendanceApi = {
  async fetchRecords(storeId, employeeId) {
    if (!storeId || !employeeId) {
      return [];
    }

    try {
      const { data } = await httpClient.get(
        `${basePath}/${storeId}/attendance`,
        { params: { employeeId } }
      );
      return Array.isArray(data?.records) ? data.records : [];
    } catch (error) {
      const status = error?.response?.status;

      if (status === 404 || status === 204) {
        return [];
      }

      if (status >= 500) {
        console.warn('근태 기록을 불러오는 중 오류가 발생했습니다.', error);
        return [];
      }

      throw error;
    }
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
