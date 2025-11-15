import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../hooks/useEmployees.js';
import { useWorkspace } from '../../hooks/useWorkspace.js';
import { DEFAULT_WORKSPACE_ROLES } from '../../constants/workspaceDefaults.js';
import { EmployeeForm } from './EmployeeForm.jsx';
import { EmployeeList } from './EmployeeList.jsx';
import { EmployeeDetailPanel } from './EmployeeDetailPanel.jsx';

export const EmployeeManagement = () => {
  const { employees, removeEmployee } = useEmployees();
  const { selectedWorkspace } = useWorkspace();
  const [formState, setFormState] = useState({ visible: false, employee: null });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const availableRoles = selectedWorkspace?.roles?.length
    ? selectedWorkspace.roles
    : DEFAULT_WORKSPACE_ROLES;

  const showForm = formState.visible;
  const editingEmployee = formState.employee;

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId),
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
      setSelectedEmployeeId(result.employeeId);
    }
  };

  const handleEmployeeEdit = (employee) => {
    setFormState({ visible: true, employee });
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployeeId((prev) => (prev === employee.id ? null : employee.id));
  };

  const handleEmployeeDelete = (employee) => {
    if (!employee) {
      return;
    }

    const confirmed = window.confirm(
      `${employee.name} (${employee.emp_id}) 직원을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.`
    );

    if (!confirmed) {
      return;
    }

    removeEmployee?.(employee.id);

    setSelectedEmployeeId((prev) => (prev === employee.id ? null : prev));

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
          <h3>선택된 워크스페이스</h3>
          <p>
            <strong>{selectedWorkspace?.name ?? '선택되지 않음'}</strong>
            {selectedWorkspace?.industry ? ` · 업종: ${selectedWorkspace.industry}` : ''}
          </p>
        </div>
        <button type="button" onClick={handlePrimaryButtonClick}>
          {showForm ? (editingEmployee ? '수정 취소' : '등록 취소') : '직원 등록'}
        </button>
      </div>

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
