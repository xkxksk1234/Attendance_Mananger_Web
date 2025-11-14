import { useState } from 'react';
import { useEmployees } from '../hooks/useEmployees.js';
import { useWorkspace } from '../../hooks/useWorkspace.js';
import { DEFAULT_WORKSPACE_ROLES } from '../../constants/workspaceDefaults.js';
import { EmployeeForm } from './EmployeeForm.jsx';
import { EmployeeList } from './EmployeeList.jsx';

export const EmployeeManagement = () => {
  const { employees } = useEmployees();
  const { selectedWorkspace } = useWorkspace();
  const [showForm, setShowForm] = useState(false);

  const availableRoles = selectedWorkspace?.roles?.length
    ? selectedWorkspace.roles
    : DEFAULT_WORKSPACE_ROLES;

  const handleComplete = () => {
    setShowForm(false);
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

      <EmployeeList employees={employees} />
    </div>
  );
};
