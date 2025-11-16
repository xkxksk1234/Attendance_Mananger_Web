import { useCallback, useEffect, useMemo, useState } from 'react';
import { storeApi } from '../api/storeApi.js';
import { StoreContext } from './StoreContext.js';

export const StoreProvider = ({ children }) => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeStoreId = useCallback((value) => {
    if (!value && value !== 0) {
      return null;
    }

    return String(value);
  }, []);

  const loadStores = useCallback(async () => {
    setLoading(true);

    try {
      const data = await storeApi.fetchStores();
      setStores(data);
      setError(null);

      if (data.length === 0) {
        setSelectedStoreId(null);
        return;
      }

      setSelectedStoreId((currentId) => {
        if (currentId && data.some((store) => String(store.id) === currentId)) {
          return currentId;
        }

        return String(data[0].id);
      });
    } catch (err) {
      console.error('매장을 불러오는 중 오류가 발생했습니다.', err);
      setError('매장 정보를 불러오는 데 실패했습니다.');
      setStores([]);
      setSelectedStoreId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const registerStore = useCallback(async (storeInput) => {
    const store = await storeApi.createStore(storeInput);
    setStores((prev) => [...prev, store]);
    setSelectedStoreId(normalizeStoreId(store.id));
    return store;
  }, [normalizeStoreId]);

  const selectStore = useCallback((storeId) => {
    setSelectedStoreId(normalizeStoreId(storeId));
  }, [normalizeStoreId]);

  const value = useMemo(() => {
    const selectedStore =
      stores.find((item) => String(item.id) === selectedStoreId) ?? null;

    return {
      stores,
      selectedStoreId,
      selectedStore,
      registerStore,
      selectStore,
      hasStores: stores.length > 0,
      isLoading: loading,
      storeError: error,
      refreshStores: loadStores
    };
  }, [
    error,
    loadStores,
    loading,
    registerStore,
    selectStore,
    selectedStoreId,
    stores
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
