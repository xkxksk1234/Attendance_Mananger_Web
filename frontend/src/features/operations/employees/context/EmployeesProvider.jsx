import { useCallback, useMemo, useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace.js';
import { EmployeesContext } from './EmployeesContext.js';

const generateEmployeeId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `emp-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

export const EmployeesProvider = ({ children }) => {
  const { selectedWorkspaceId } = useWorkspace();
  const [registry, setRegistry] = useState({});

  const registerEmployeeForWorkspace = useCallback((workspaceId, employeeInput) => {
    if (!workspaceId) {
      throw new Error('워크스페이스를 선택한 후 직원을 등록할 수 있습니다.');
    }

    const employee = {
      id: generateEmployeeId(),
      ...employeeInput
    };

    setRegistry((prev) => {
      const previousEmployees = prev[workspaceId] ?? [];
      return {
        ...prev,
        [workspaceId]: [...previousEmployees, employee]
      };
    });

    return employee;
  }, []);

  const value = useMemo(() => {
    const employees = selectedWorkspaceId ? registry[selectedWorkspaceId] ?? [] : [];

    return {
      employees,
      hasEmployees: employees.length > 0,
      registerEmployee: (employeeInput) =>
        registerEmployeeForWorkspace(selectedWorkspaceId, employeeInput),
      getEmployeesByWorkspace: (workspaceId) => registry[workspaceId] ?? []
    };
  }, [registerEmployeeForWorkspace, registry, selectedWorkspaceId]);

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>;
};
