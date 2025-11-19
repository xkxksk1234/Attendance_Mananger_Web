import { useCallback, useEffect, useMemo, useState } from 'react';
import { employeeApi } from '../../api/employeeApi.js';
import { useStore } from '../../hooks/useStore.js';
import { EmployeesContext } from './EmployeesContext.js';

export const EmployeesProvider = ({ children }) => {
  const { selectedStoreId } = useStore();
  const [registry, setRegistry] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const loadEmployeesForStore = useCallback(async (storeId) => {
    if (!storeId) {
      return [];
    }

    setLoadingMap((prev) => ({ ...prev, [storeId]: true }));

    try {
      const employees = await employeeApi.fetchEmployees(storeId);
      setRegistry((prev) => ({ ...prev, [storeId]: employees }));
      setErrorMap((prev) => ({ ...prev, [storeId]: null }));
      return employees;
    } catch (error) {
      console.error('직원 목록을 불러오는 중 오류가 발생했습니다.', error);
      setErrorMap((prev) => ({ ...prev, [storeId]: '직원 목록을 불러오는 데 실패했습니다.' }));
      return [];
    } finally {
      setLoadingMap((prev) => ({ ...prev, [storeId]: false }));
    }
  }, []);

  useEffect(() => {
    if (selectedStoreId) {
      loadEmployeesForStore(selectedStoreId);
    }
  }, [loadEmployeesForStore, selectedStoreId]);

  const registerEmployeeForStore = useCallback(
    async (storeId, employeeInput) => {
      if (!storeId) {
        throw new Error('매장을 선택한 후 직원을 등록할 수 있습니다.');
      }

      const employee = await employeeApi.createEmployee(storeId, employeeInput);

      setRegistry((prev) => {
        const previousEmployees = prev[storeId] ?? [];
        return {
          ...prev,
          [storeId]: [...previousEmployees, employee]
        };
      });

      return employee;
    },
    []
  );

  const updateEmployeeForStore = useCallback(
    async (storeId, employeeId, updates) => {
      if (!storeId) {
        throw new Error('매장을 선택한 후 직원을 수정할 수 있습니다.');
      }

      const employee = await employeeApi.updateEmployee(storeId, employeeId, updates);

      setRegistry((prev) => {
        const previousEmployees = prev[storeId] ?? [];
        const nextEmployees = previousEmployees.map((item) =>
          item.id === employeeId ? employee : item
        );

        return {
          ...prev,
          [storeId]: nextEmployees
        };
      });

      return employee;
    },
    []
  );

  const deleteEmployeeForStore = useCallback(async (storeId, employeeId) => {
    if (!storeId) {
      throw new Error('매장을 선택한 후 직원을 삭제할 수 있습니다.');
    }

    await employeeApi.deleteEmployee(storeId, employeeId);

    setRegistry((prev) => {
      const previousEmployees = prev[storeId] ?? [];
      return {
        ...prev,
        [storeId]: previousEmployees.filter((employee) => employee.id !== employeeId)
      };
    });

    return true;
  }, []);

  const value = useMemo(() => {
    const employees = selectedStoreId ? registry[selectedStoreId] ?? [] : [];
    const isLoading = selectedStoreId ? loadingMap[selectedStoreId] ?? false : false;
    const error = selectedStoreId ? errorMap[selectedStoreId] : null;

    return {
      employees,
      hasEmployees: employees.length > 0,
      isLoading,
      error,
      registerEmployee: (employeeInput) =>
        registerEmployeeForStore(selectedStoreId, employeeInput),
      updateEmployee: (employeeId, updates) =>
        updateEmployeeForStore(selectedStoreId, employeeId, updates),
      removeEmployee: (employeeId) =>
        deleteEmployeeForStore(selectedStoreId, employeeId),
      getEmployeesByStore: (storeId) => registry[storeId] ?? [],
      reloadEmployees: () => loadEmployeesForStore(selectedStoreId)
    };
  }, [
    deleteEmployeeForStore,
    errorMap,
    loadEmployeesForStore,
    loadingMap,
    registerEmployeeForStore,
    registry,
    selectedStoreId,
    updateEmployeeForStore
  ]);

  return <EmployeesContext.Provider value={value}>{children}</EmployeesContext.Provider>;
};
