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

  const updateEmployeeForWorkspace = useCallback((workspaceId, employeeId, updates) => {
    if (!workspaceId) {
      throw new Error('워크스페이스를 선택한 후 직원을 수정할 수 있습니다.');
    }

    let updatedEmployee = null;

    setRegistry((prev) => {
      const previousEmployees = prev[workspaceId] ?? [];

      if (!previousEmployees.some((employee) => employee.id === employeeId)) {
        return prev;
      }

      const nextEmployees = previousEmployees.map((employee) => {
        if (employee.id !== employeeId) {
          return employee;
        }

        updatedEmployee = { ...employee, ...updates };
        return updatedEmployee;
      });

      return {
        ...prev,
        [workspaceId]: nextEmployees
      };
    });

    return updatedEmployee;
  }, []);

  const deleteEmployeeForWorkspace = useCallback((workspaceId, employeeId) => {
    if (!workspaceId) {
      throw new Error('워크스페이스를 선택한 후 직원을 삭제할 수 있습니다.');
    }

    let removed = false;

    setRegistry((prev) => {
      const previousEmployees = prev[workspaceId] ?? [];
      const nextEmployees = previousEmployees.filter((employee) => {
        if (employee.id === employeeId) {
          removed = true;
          return false;
        }

        return true;
      });

      if (previousEmployees.length === nextEmployees.length) {
        return prev;
      }

      return {
        ...prev,
        [workspaceId]: nextEmployees
      };
    });

    return removed;
  }, []);

  const value = useMemo(() => {
    const employees = selectedWorkspaceId ? registry[selectedWorkspaceId] ?? [] : [];

    return {
      employees,
      hasEmployees: employees.length > 0,
      registerEmployee: (employeeInput) =>
        registerEmployeeForWorkspace(selectedWorkspaceId, employeeInput),
      updateEmployee: (employeeId, updates) =>
        updateEmployeeForWorkspace(selectedWorkspaceId, employeeId, updates),
      removeEmployee: (employeeId) =>
        deleteEmployeeForWorkspace(selectedWorkspaceId, employeeId),
      getEmployeesByWorkspace: (workspaceId) => registry[workspaceId] ?? []
    };
  }, [
    deleteEmployeeForWorkspace,
    registerEmployeeForWorkspace,
    registry,
    selectedWorkspaceId,
    updateEmployeeForWorkspace
  ]);

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>;
};
