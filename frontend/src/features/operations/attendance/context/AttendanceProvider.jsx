import { useCallback, useMemo, useState } from 'react';
import { useWorkspace } from '../../hooks/useWorkspace.js';
import { AttendanceContext } from './AttendanceContext.js';

const generateRecordId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `att-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

const sortRecordsDesc = (records) => {
  return [...records].sort((a, b) => {
    const aDate = new Date(`${a.date}T${a.checkIn ?? '00:00'}`);
    const bDate = new Date(`${b.date}T${b.checkIn ?? '00:00'}`);
    return bDate.getTime() - aDate.getTime();
  });
};

export const AttendanceProvider = ({ children }) => {
  const { selectedWorkspaceId } = useWorkspace();
  const [registry, setRegistry] = useState({});

  const registerRecordForEmployee = useCallback((workspaceId, employeeId, input) => {
    if (!workspaceId) {
      throw new Error('워크스페이스를 선택한 후 근태 기록을 등록할 수 있습니다.');
    }

    if (!employeeId) {
      throw new Error('직원을 선택한 후 근태 기록을 등록할 수 있습니다.');
    }

    const record = {
      id: generateRecordId(),
      employeeId,
      ...input
    };

    setRegistry((prev) => {
      const workspaceRecords = prev[workspaceId] ?? {};
      const employeeRecords = workspaceRecords[employeeId] ?? [];
      const nextEmployeeRecords = sortRecordsDesc([...employeeRecords, record]);

      return {
        ...prev,
        [workspaceId]: {
          ...workspaceRecords,
          [employeeId]: nextEmployeeRecords
        }
      };
    });

    return record;
  }, []);

  const updateRecordForEmployee = useCallback((workspaceId, employeeId, recordId, updates) => {
    if (!workspaceId) {
      throw new Error('워크스페이스를 선택한 후 근태 기록을 수정할 수 있습니다.');
    }

    if (!employeeId) {
      throw new Error('직원을 선택한 후 근태 기록을 수정할 수 있습니다.');
    }

    let updatedRecord = null;

    setRegistry((prev) => {
      const workspaceRecords = prev[workspaceId] ?? {};
      const employeeRecords = workspaceRecords[employeeId] ?? [];

      if (employeeRecords.length === 0) {
        return prev;
      }

      const nextEmployeeRecords = sortRecordsDesc(
        employeeRecords.map((record) => {
          if (record.id !== recordId) {
            return record;
          }

          updatedRecord = { ...record, ...updates };
          return updatedRecord;
        })
      );

      return {
        ...prev,
        [workspaceId]: {
          ...workspaceRecords,
          [employeeId]: nextEmployeeRecords
        }
      };
    });

    return updatedRecord;
  }, []);

  const deleteRecordForEmployee = useCallback((workspaceId, employeeId, recordId) => {
    if (!workspaceId) {
      throw new Error('워크스페이스를 선택한 후 근태 기록을 삭제할 수 있습니다.');
    }

    if (!employeeId) {
      throw new Error('직원을 선택한 후 근태 기록을 삭제할 수 있습니다.');
    }

    let removed = false;

    setRegistry((prev) => {
      const workspaceRecords = prev[workspaceId] ?? {};
      const employeeRecords = workspaceRecords[employeeId] ?? [];
      const nextEmployeeRecords = employeeRecords.filter((record) => {
        if (record.id === recordId) {
          removed = true;
          return false;
        }

        return true;
      });

      if (employeeRecords.length === nextEmployeeRecords.length) {
        return prev;
      }

      return {
        ...prev,
        [workspaceId]: {
          ...workspaceRecords,
          [employeeId]: nextEmployeeRecords
        }
      };
    });

    return removed;
  }, []);

  const value = useMemo(() => {
    const workspaceRecords = selectedWorkspaceId ? registry[selectedWorkspaceId] ?? {} : {};

    return {
      getRecordsForEmployee: (employeeId) => workspaceRecords[employeeId] ?? [],
      registerRecord: (employeeId, input) =>
        registerRecordForEmployee(selectedWorkspaceId, employeeId, input),
      updateRecord: (employeeId, recordId, updates) =>
        updateRecordForEmployee(selectedWorkspaceId, employeeId, recordId, updates),
      removeRecord: (employeeId, recordId) =>
        deleteRecordForEmployee(selectedWorkspaceId, employeeId, recordId),
      hasRecords: Object.values(workspaceRecords).some((records) => (records?.length ?? 0) > 0)
    };
  }, [
    deleteRecordForEmployee,
    registerRecordForEmployee,
    registry,
    selectedWorkspaceId,
    updateRecordForEmployee
  ]);

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};
