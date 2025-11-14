import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_WORKSPACE_ROLES } from '../constants/workspaceDefaults.js';
import { WorkspaceContext } from './WorkspaceContext.js';

const generateWorkspaceId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `ws-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(null);

  useEffect(() => {
    if (workspaces.length === 0) {
      setSelectedWorkspaceId(null);
      return;
    }

    setSelectedWorkspaceId((currentId) => {
      if (!currentId) {
        return workspaces[0].id;
      }

      return workspaces.some((workspace) => workspace.id === currentId)
        ? currentId
        : workspaces[0].id;
    });
  }, [workspaces]);

  const registerWorkspace = useCallback((workspaceInput) => {
    const workspaceRoles = workspaceInput.roles?.length
      ? [...workspaceInput.roles]
      : [...DEFAULT_WORKSPACE_ROLES];

    const workspace = {
      id: generateWorkspaceId(),
      ...workspaceInput,
      roles: workspaceRoles
    };

    setWorkspaces((prev) => [...prev, workspace]);
    setSelectedWorkspaceId(workspace.id);

    return workspace;
  }, []);

  const selectWorkspace = useCallback((workspaceId) => {
    setSelectedWorkspaceId(workspaceId);
  }, []);

  const value = useMemo(() => {
    const selectedWorkspace = workspaces.find((item) => item.id === selectedWorkspaceId) ?? null;

    return {
      workspaces,
      selectedWorkspaceId,
      selectedWorkspace,
      registerWorkspace,
      selectWorkspace,
      hasWorkspaces: workspaces.length > 0
    };
  }, [registerWorkspace, selectWorkspace, selectedWorkspaceId, workspaces]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};
