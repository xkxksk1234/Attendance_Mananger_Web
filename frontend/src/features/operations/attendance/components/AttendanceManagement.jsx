import { useEffect, useMemo, useState } from 'react';
import { useEmployees } from '../../employees/hooks/useEmployees.js';
import { useAttendance } from '../hooks/useAttendance.js';
import { AttendanceRecordForm } from './AttendanceRecordForm.jsx';
import { AttendanceRecordList } from './AttendanceRecordList.jsx';
import { AttendanceRecordDetail } from './AttendanceRecordDetail.jsx';
import { AttendanceSummary } from './AttendanceSummary.jsx';

export const AttendanceManagement = () => {
  const { employees, isLoading: employeesLoading } = useEmployees();
  const {
    getRecordsForEmployee,
    registerRecord,
    updateRecord,
    removeRecord,
    loadRecords,
    isLoadingRecords,
    recordError
  } = useAttendance();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  useEffect(() => {
    if (!employees.length) {
      setSelectedEmployeeId('');
      setIsFormOpen(false);
      setEditingRecord(null);
      setSelectedRecordId(null);
      return;
    }

    setSelectedEmployeeId((prev) => {
      if (prev && employees.some((employee) => String(employee.id) === prev)) {
        return prev;
      }

      return String(employees[0].id);
    });
  }, [employees]);

  const selectedEmployee =
    employees.find((employee) => String(employee.id) === selectedEmployeeId) ?? null;

  const records = useMemo(() => {
    if (!selectedEmployeeId) {
      return [];
    }

    return getRecordsForEmployee(selectedEmployeeId);
  }, [getRecordsForEmployee, selectedEmployeeId]);

  useEffect(() => {
    if (selectedEmployeeId) {
      loadRecords(selectedEmployeeId);
    }
  }, [loadRecords, selectedEmployeeId]);

  const selectedRecord = useMemo(() => {
    return records.find((record) => record.id === selectedRecordId) ?? null;
  }, [records, selectedRecordId]);

  const handleSelectEmployee = (event) => {
    setSelectedEmployeeId(event.target.value);
    setIsFormOpen(false);
    setEditingRecord(null);
    setSelectedRecordId(null);
  };

  const handleCreateRequest = () => {
    setIsFormOpen(true);
    setEditingRecord(null);
    setSelectedRecordId(null);
  };

  const handleEditRecord = (record) => {
    setIsFormOpen(true);
    setEditingRecord(record);
    setSelectedRecordId(null);
  };

  const handleSelectRecord = (record) => {
    setSelectedRecordId(record.id);
  };

  const handleDeleteRecord = async (record) => {
    const confirmed = window.confirm(
      `${selectedEmployee?.name ?? ''} 직원의 ${record.date} 근태 기록을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeRecord(selectedEmployeeId, record.id);
    } catch (error) {
      console.error('근태 기록을 삭제하는 중 오류가 발생했습니다.', error);
      return;
    }

    if (editingRecord?.id === record.id) {
      setEditingRecord(null);
      setIsFormOpen(false);
    }

    if (selectedRecordId === record.id) {
      setSelectedRecordId(null);
    }
  };

  const handleSubmit = async (formValues) => {
    if (!selectedEmployeeId) {
      return;
    }

    try {
      if (editingRecord) {
        await updateRecord(selectedEmployeeId, editingRecord.id, formValues);
      } else {
        await registerRecord(selectedEmployeeId, formValues);
      }
    } catch (error) {
      console.error('근태 기록을 저장하는 중 오류가 발생했습니다.', error);
      return;
    }

    setIsFormOpen(false);
    setEditingRecord(null);
    setSelectedRecordId(null);
  };

  const isLoading = selectedEmployeeId ? isLoadingRecords(selectedEmployeeId) : false;
  const error = selectedEmployeeId ? recordError(selectedEmployeeId) : null;

  if (employeesLoading) {
    return <p className="attendance-loading">직원 정보를 불러오는 중입니다...</p>;
  }

  if (!employees.length) {
    return <p className="attendance-empty">직원 등록 후 근태 기록을 관리할 수 있습니다.</p>;
  }

  return (
    <div className="attendance-management">
      <div className="attendance-selector">
        <label htmlFor="attendanceEmployeeSelect">근태 조회 직원</label>
        <select id="attendanceEmployeeSelect" value={selectedEmployeeId} onChange={handleSelectEmployee}>
          {employees.map((employee) => (
            <option key={employee.id} value={String(employee.id)}>
              {employee.name} ({employee.emp_id})
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee ? (
        <>
          <div className="attendance-toolbar">
            <div>
              <h3>{selectedEmployee.name}님 근태 기록</h3>
              <p>필요 시 언제든지 수정하거나 삭제할 수 있습니다.</p>
            </div>
            <button type="button" onClick={handleCreateRequest} className="attendance-create-button">
              근태 등록
            </button>
          </div>

          {isFormOpen && (
            <AttendanceRecordForm
              employee={selectedEmployee}
              initialValues={editingRecord}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsFormOpen(false);
                setEditingRecord(null);
              }}
            />
          )}

          {isLoading && <p className="attendance-loading">근태 기록을 불러오는 중입니다...</p>}
          {error && !isLoading && (
            <p className="attendance-error" role="alert">
              {error}
            </p>
          )}

          <AttendanceSummary records={records} employeeName={selectedEmployee.name} />

          <AttendanceRecordList
            records={records}
            onEdit={handleEditRecord}
            onDelete={handleDeleteRecord}
            onSelect={handleSelectRecord}
            selectedRecordId={selectedRecordId}
          />

          {selectedRecord && (
            <AttendanceRecordDetail
              record={selectedRecord}
              employeeName={selectedEmployee.name}
              employeeNumber={selectedEmployee.emp_id}
              onClose={() => setSelectedRecordId(null)}
              onEdit={() => handleEditRecord(selectedRecord)}
              onDelete={() => handleDeleteRecord(selectedRecord)}
            />
          )}
        </>
      ) : (
        <p className="attendance-empty">직원을 선택하면 근태 기록이 여기에 표시됩니다.</p>
      )}
    </div>
  );
};
