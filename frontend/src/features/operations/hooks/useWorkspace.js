import { useContext } from 'react';
import { WorkspaceContext } from '../context/WorkspaceContext.js';

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error('useWorkspace는 WorkspaceProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};
