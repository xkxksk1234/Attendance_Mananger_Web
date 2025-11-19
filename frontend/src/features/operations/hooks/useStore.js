import { useContext } from 'react';
import { StoreContext } from '../context/StoreContext.js';

export const useStore = () => {
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error('useStore는 StoreProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};
