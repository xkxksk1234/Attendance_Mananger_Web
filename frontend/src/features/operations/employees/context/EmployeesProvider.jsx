import { useCallback, useEffect, useMemo, useState } from 'react';
import { employeeApi } from '../../api/employeeApi.js';
import { useWorkspace } from '../../hooks/useWorkspace.js';
import { EmployeesContext } from './EmployeesContext.js';

export const EmployeesProvider = ({ children }) => {
  const { selectedWorkspaceId } = useWorkspace();
  const [registry, setRegistry] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const loadEmployeesForWorkspace = useCallback(async (workspaceId) => {
    if (!workspaceId) {
      return [];
    }

    setLoadingMap((prev) => ({ ...prev, [workspaceId]: true }));

    try {
      const employees = await employeeApi.fetchEmployees(workspaceId);
      setRegistry((prev) => ({ ...prev, [workspaceId]: employees }));
      setErrorMap((prev) => ({ ...prev, [workspaceId]: null }));
      return employees;
    } catch (error) {
      console.error('직원 목록을 불러오는 중 오류가 발생했습니다.', error);
      setErrorMap((prev) => ({ ...prev, [workspaceId]: '직원 목록을 불러오는 데 실패했습니다.' }));
      return [];
    } finally {
      setLoadingMap((prev) => ({ ...prev, [workspaceId]: false }));
    }
  }, []);

  useEffect(() => {
    if (selectedWorkspaceId) {
      loadEmployeesForWorkspace(selectedWorkspaceId);
    }
  }, [loadEmployeesForWorkspace, selectedWorkspaceId]);

  const registerEmployeeForWorkspace = useCallback(
    async (workspaceId, employeeInput) => {
      if (!workspaceId) {
        throw new Error('워크스페이스를 선택한 후 직원을 등록할 수 있습니다.');
      }

      const employee = await employeeApi.createEmployee(workspaceId, employeeInput);

      setRegistry((prev) => {
        const previousEmployees = prev[workspaceId] ?? [];
        return {
          ...prev,
          [workspaceId]: [...previousEmployees, employee]
        };
      });

      return employee;
    },
    []
  );

  const updateEmployeeForWorkspace = useCallback(
    async (workspaceId, employeeId, updates) => {
      if (!workspaceId) {
        throw new Error('워크스페이스를 선택한 후 직원을 수정할 수 있습니다.');
      }

      const employee = await employeeApi.updateEmployee(workspaceId, employeeId, updates);

      setRegistry((prev) => {
        const previousEmployees = prev[workspaceId] ?? [];
        const nextEmployees = previousEmployees.map((item) =>
          item.id === employeeId ? employee : item
        );

        return {
          ...prev,
          [workspaceId]: nextEmployees
        };
      });

      return employee;
    },
    []
  );

  const deleteEmployeeForWorkspace = useCallback(async (workspaceId, employeeId) => {
    if (!workspaceId) {
      throw new Error('워크스페이스를 선택한 후 직원을 삭제할 수 있습니다.');
    }

    await employeeApi.deleteEmployee(workspaceId, employeeId);

    setRegistry((prev) => {
      const previousEmployees = prev[workspaceId] ?? [];
      return {
        ...prev,
        [workspaceId]: previousEmployees.filter((employee) => employee.id !== employeeId)
      };
    });

    return true;
  }, []);

  const value = useMemo(() => {
    const employees = selectedWorkspaceId ? registry[selectedWorkspaceId] ?? [] : [];
    const isLoading = selectedWorkspaceId ? loadingMap[selectedWorkspaceId] ?? false : false;
    const error = selectedWorkspaceId ? errorMap[selectedWorkspaceId] : null;

    return {
      employees,
      hasEmployees: employees.length > 0,
      isLoading,
      error,
      registerEmployee: (employeeInput) =>
        registerEmployeeForWorkspace(selectedWorkspaceId, employeeInput),
      updateEmployee: (employeeId, updates) =>
        updateEmployeeForWorkspace(selectedWorkspaceId, employeeId, updates),
      removeEmployee: (employeeId) =>
        deleteEmployeeForWorkspace(selectedWorkspaceId, employeeId),
      getEmployeesByWorkspace: (workspaceId) => registry[workspaceId] ?? [],
      reloadEmployees: () => loadEmployeesForWorkspace(selectedWorkspaceId)
    };
  }, [
    deleteEmployeeForWorkspace,
    errorMap,
    loadEmployeesForWorkspace,
    loadingMap,
    registerEmployeeForWorkspace,
    registry,
    selectedWorkspaceId,
    updateEmployeeForWorkspace
  ]);

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>;
};
