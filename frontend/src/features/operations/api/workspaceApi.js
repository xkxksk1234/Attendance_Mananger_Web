import { httpClient } from '../../../shared/api/httpClient.js';

const basePath = '/api/workspaces';

export const workspaceApi = {
  async fetchWorkspaces() {
    const { data } = await httpClient.get(basePath);
    return data.workspaces ?? [];
  },

  async createWorkspace(payload) {
    const { data } = await httpClient.post(basePath, payload);
    return data.workspace;
  }
};
