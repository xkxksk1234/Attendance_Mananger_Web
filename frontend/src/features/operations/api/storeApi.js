import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/stores';

export const storeApi = {
  async fetchStores() {
    const { data } = await httpClient.get(basePath);
    return data.stores ?? [];
  },

  async createStore(payload) {
    const { data } = await httpClient.post(basePath, payload);
    return data.store;
  },

  async deleteStore(storeId) {
    await httpClient.delete(`${basePath}/${storeId}`);
  }
};
