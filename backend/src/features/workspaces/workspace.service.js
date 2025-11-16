import { DEFAULT_WORKSPACE_ROLES } from './workspace.constants.js';
import { workspaceRepository } from './workspace.repository.js';

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');

export const workspaceService = {
  async listWorkspaces() {
    return workspaceRepository.findAll();
  },

  async createWorkspace(input) {
    const name = sanitize(input.name);
    const industry = sanitize(input.industry);
    const roles = Array.isArray(input.roles) && input.roles.length > 0
      ? input.roles.map((role) => sanitize(role)).filter(Boolean)
      : DEFAULT_WORKSPACE_ROLES;

    return workspaceRepository.create(
      {
        name,
        industry,
        underFive: Boolean(input.underFive)
      },
      roles
    );
  },

  async getWorkspaceById(id) {
    return workspaceRepository.findById(id);
  }
};
