import { useCallback, useEffect, useMemo, useState } from 'react';
import { workspaceApi } from '../api/workspaceApi.js';
import { WorkspaceContext } from './WorkspaceContext.js';

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const normalizeWorkspaceId = useCallback((value) => {
    if (!value && value !== 0) {
      return null;
    }

    return String(value);
  }, []);

  const loadWorkspaces = useCallback(async () => {
    setLoading(true);

    try {
      const data = await workspaceApi.fetchWorkspaces();
      setWorkspaces(data);
      setError(null);

      if (data.length === 0) {
        setSelectedWorkspaceId(null);
        return;
      }

      setSelectedWorkspaceId((currentId) => {
        if (currentId && data.some((workspace) => String(workspace.id) === currentId)) {
          return currentId;
        }

        return String(data[0].id);
      });
    } catch (err) {
      console.error('워크스페이스를 불러오는 중 오류가 발생했습니다.', err);
      setError('워크스페이스 정보를 불러오는 데 실패했습니다.');
      setWorkspaces([]);
      setSelectedWorkspaceId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkspaces();
  }, [loadWorkspaces]);

  const registerWorkspace = useCallback(async (workspaceInput) => {
    const workspace = await workspaceApi.createWorkspace(workspaceInput);
    setWorkspaces((prev) => [...prev, workspace]);
    setSelectedWorkspaceId(normalizeWorkspaceId(workspace.id));
    return workspace;
  }, [normalizeWorkspaceId]);

  const selectWorkspace = useCallback((workspaceId) => {
    setSelectedWorkspaceId(normalizeWorkspaceId(workspaceId));
  }, [normalizeWorkspaceId]);

  const value = useMemo(() => {
    const selectedWorkspace =
      workspaces.find((item) => String(item.id) === selectedWorkspaceId) ?? null;

    return {
      workspaces,
      selectedWorkspaceId,
      selectedWorkspace,
      registerWorkspace,
      selectWorkspace,
      hasWorkspaces: workspaces.length > 0,
      isLoading: loading,
      workspaceError: error,
      refreshWorkspaces: loadWorkspaces
    };
  }, [
    error,
    loadWorkspaces,
    loading,
    registerWorkspace,
    selectWorkspace,
    selectedWorkspaceId,
    workspaces
  ]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};
