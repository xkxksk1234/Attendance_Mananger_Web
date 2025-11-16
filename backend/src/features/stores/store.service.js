import { DEFAULT_STORE_ROLES } from './store.constants.js';
import { storeRepository } from './store.repository.js';

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');

export const storeService = {
  async listStores() {
    return storeRepository.findAll();
  },

  async createStore(input) {
    const name = sanitize(input.name);
    const industry = sanitize(input.industry);
    const roles = Array.isArray(input.roles) && input.roles.length > 0
      ? input.roles.map((role) => sanitize(role)).filter(Boolean)
      : DEFAULT_STORE_ROLES;

    return storeRepository.create(
      {
        name,
        industry,
        underFive: Boolean(input.underFive)
      },
      roles
    );
  },

  async getStoreById(id) {
    return storeRepository.findById(id);
  }
};
