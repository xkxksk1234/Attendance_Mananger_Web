import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/auth';

export const authApi = {
  async login(credentials) {
    const response = await httpClient.post(`${basePath}/login`, credentials);
    return response.data;
  },

  async registerAccount(payload) {
    const response = await httpClient.post(`${basePath}/register`, payload);
    return response.data;
  },

  async logout() {
    const response = await httpClient.post(`${basePath}/logout`);
    return response.data;
  },

  async fetchSession() {
    const response = await httpClient.get(`${basePath}/session`);
    return response.data;
  },

  async deleteAccount(payload) {
    const response = await httpClient.delete(`${basePath}/account`, { data: payload });
    return response.data;
  }
};
