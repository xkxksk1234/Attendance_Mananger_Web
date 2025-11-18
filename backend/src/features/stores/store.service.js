import { DEFAULT_STORE_ROLES } from './store.constants.js';
import { storeRepository } from './store.repository.js';

const sanitize = (value) => (typeof value === 'string' ? value.trim() : '');

export const storeService = {
  async listStores(ownerId) {
    return storeRepository.findAllByOwner(ownerId);
  },

  async createStore(ownerId, input) {
    const name = sanitize(input.name);
    const industry = sanitize(input.industry);
    const roles = Array.isArray(input.roles) && input.roles.length > 0
      ? input.roles.map((role) => sanitize(role)).filter(Boolean)
      : DEFAULT_STORE_ROLES;

    return storeRepository.create(
      ownerId,
      {
        name,
        industry,
        underFive: Boolean(input.underFive)
      },
      roles
    );
  },

  async ensureStoreAccess(ownerId, storeId) {
    return storeRepository.findByIdForOwner(ownerId, storeId);
  },

  async deleteStore(ownerId, storeId) {
    return storeRepository.delete(ownerId, storeId);
  }
};
