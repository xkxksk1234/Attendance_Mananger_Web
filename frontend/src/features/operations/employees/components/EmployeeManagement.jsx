import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../hooks/useEmployees.js';
import { useWorkspace } from '../../hooks/useWorkspace.js';
import { DEFAULT_WORKSPACE_ROLES } from '../../constants/workspaceDefaults.js';
import { EmployeeForm } from './EmployeeForm.jsx';
import { EmployeeList } from './EmployeeList.jsx';
import { EmployeeDetailPanel } from './EmployeeDetailPanel.jsx';

export const EmployeeManagement = () => {
  const { employees } = useEmployees();
  const { selectedWorkspace } = useWorkspace();
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const availableRoles = selectedWorkspace?.roles?.length
    ? selectedWorkspace.roles
    : DEFAULT_WORKSPACE_ROLES;

  const selectedEmployee = useMemo(
    () => employees.find((employee) => employee.id === selectedEmployeeId),
    [employees, selectedEmployeeId]
  );

  useEffect(() => {
    if (selectedEmployeeId && !selectedEmployee) {
      setSelectedEmployeeId(null);
    }
  }, [selectedEmployee, selectedEmployeeId]);

  const handleComplete = () => {
    setShowForm(false);
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployeeId((prev) => (prev === employee.id ? null : employee.id));
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
        <button type="button" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? '등록 취소' : '직원 등록'}
        </button>
      </div>

      {showForm && (
        <EmployeeForm availableRoles={availableRoles} onComplete={handleComplete} />
      )}

      <EmployeeList
        employees={employees}
        onSelect={handleEmployeeSelect}
        selectedEmployeeId={selectedEmployeeId}
      />

      {selectedEmployee && (
        <EmployeeDetailPanel employee={selectedEmployee} onClose={handleDetailClose} />
      )}
    </div>
  );
};
