import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../hooks/useEmployees.js';
import { useStore } from '../../hooks/useStore.js';
import { DEFAULT_STORE_ROLES } from '../../constants/storeDefaults.js';
import { EmployeeForm } from './EmployeeForm.jsx';
import { EmployeeList } from './EmployeeList.jsx';
import { EmployeeDetailPanel } from './EmployeeDetailPanel.jsx';

export const EmployeeManagement = () => {
  const { employees, removeEmployee, isLoading, error } = useEmployees();
  const { selectedStore } = useStore();
  const [formState, setFormState] = useState({ visible: false, employee: null });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const availableRoles = selectedStore?.roles?.length
    ? selectedStore.roles
    : DEFAULT_STORE_ROLES;

  const showForm = formState.visible;
  const editingEmployee = formState.employee;

  const selectedEmployee = useMemo(
    () => employees.find((employee) => String(employee.id) === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  useEffect(() => {
    if (selectedEmployeeId && !selectedEmployee) {
      setSelectedEmployeeId(null);
    }
  }, [selectedEmployee, selectedEmployeeId]);

  const closeForm = () => {
    setFormState({ visible: false, employee: null });
  };

  const handlePrimaryButtonClick = () => {
    setFormState((prev) => {
      if (prev.visible && !prev.employee) {
        return { visible: false, employee: null };
      }

      return { visible: !prev.visible, employee: null };
    });
  };

  const handleFormComplete = (result) => {
    closeForm();
    if (result?.employeeId) {
      setSelectedEmployeeId(String(result.employeeId));
    }
  };

  const handleEmployeeEdit = (employee) => {
    setFormState({ visible: true, employee });
  };

  const handleEmployeeSelect = (employee) => {
    const nextId = String(employee.id);
    setSelectedEmployeeId((prev) => (prev === nextId ? null : nextId));
  };

  const handleEmployeeDelete = async (employee) => {
    if (!employee) {
      return;
    }

    const confirmed = window.confirm(
      `${employee.name} (${employee.emp_id}) 직원을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeEmployee?.(employee.id);
    } catch (err) {
      console.error('직원을 삭제하는 중 오류가 발생했습니다.', err);
      return;
    }

    const targetId = String(employee.id);
    setSelectedEmployeeId((prev) => (prev === targetId ? null : prev));

    setFormState((prev) => {
      if (prev.employee?.id === employee.id) {
        return { visible: false, employee: null };
      }

      return prev;
    });
  };

  const handleDetailClose = () => {
    setSelectedEmployeeId(null);
  };

  return (
    <div className="employee-management">
      <div className="employee-management-header">
        <div>
          <h3>선택된 매장</h3>
          <p>
            <strong>{selectedStore?.name ?? '선택되지 않음'}</strong>
            {selectedStore?.industry ? ` · 업종: ${selectedStore.industry}` : ''}
          </p>
        </div>
        <button type="button" onClick={handlePrimaryButtonClick}>
          {showForm ? (editingEmployee ? '수정 취소' : '등록 취소') : '직원 등록'}
        </button>
      </div>

      {isLoading && <p className="employee-loading">직원 정보를 불러오는 중입니다...</p>}
      {error && !isLoading && (
        <p className="employee-error" role="alert">
          {error}
        </p>
      )}

      {showForm && (
        <EmployeeForm
          availableRoles={availableRoles}
          initialValues={editingEmployee}
          onComplete={handleFormComplete}
        />
      )}

      <EmployeeList
        employees={employees}
        onSelect={handleEmployeeSelect}
        selectedEmployeeId={selectedEmployeeId}
        onEdit={handleEmployeeEdit}
        onDelete={handleEmployeeDelete}
      />

      {selectedEmployee && (
        <EmployeeDetailPanel
          employee={selectedEmployee}
          onClose={handleDetailClose}
          onEdit={handleEmployeeEdit}
          onDelete={handleEmployeeDelete}
        />
      )}
    </div>
  );
};
