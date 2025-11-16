import { useCallback, useMemo, useState } from 'react';
import { attendanceApi } from '../../api/attendanceApi.js';
import { useWorkspace } from '../../hooks/useWorkspace.js';
import { AttendanceContext } from './AttendanceContext.js';

const buildLoadingKey = (workspaceId, employeeId) => `${workspaceId}:${employeeId}`;

export const AttendanceProvider = ({ children }) => {
  const { selectedWorkspaceId } = useWorkspace();
  const [registry, setRegistry] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const loadRecordsForEmployee = useCallback(async (workspaceId, employeeId) => {
    if (!workspaceId || !employeeId) {
      return [];
    }

    const key = buildLoadingKey(workspaceId, employeeId);
    setLoadingMap((prev) => ({ ...prev, [key]: true }));

    try {
      const records = await attendanceApi.fetchRecords(workspaceId, employeeId);
      setRegistry((prev) => ({
        ...prev,
        [workspaceId]: {
          ...(prev[workspaceId] ?? {}),
          [employeeId]: records
        }
      }));
      setErrorMap((prev) => ({ ...prev, [key]: null }));
      return records;
    } catch (error) {
      console.error('근태 기록을 불러오는 중 오류가 발생했습니다.', error);
      setErrorMap((prev) => ({ ...prev, [key]: '근태 기록을 불러오는 데 실패했습니다.' }));
      return [];
    } finally {
      setLoadingMap((prev) => ({ ...prev, [key]: false }));
    }
  }, []);

  const registerRecordForEmployee = useCallback(
    async (workspaceId, employeeId, input) => {
      if (!workspaceId) {
        throw new Error('워크스페이스를 선택한 후 근태 기록을 등록할 수 있습니다.');
      }

      if (!employeeId) {
        throw new Error('직원을 선택한 후 근태 기록을 등록할 수 있습니다.');
      }

      const record = await attendanceApi.createRecord(workspaceId, {
        ...input,
        employeeId
      });

      await loadRecordsForEmployee(workspaceId, employeeId);

      return record;
    },
    [loadRecordsForEmployee]
  );

  const updateRecordForEmployee = useCallback(
    async (workspaceId, employeeId, recordId, updates) => {
      if (!workspaceId || !employeeId) {
        throw new Error('근태 기록을 수정하려면 워크스페이스와 직원을 선택하세요.');
      }

      const record = await attendanceApi.updateRecord(workspaceId, recordId, updates);
      await loadRecordsForEmployee(workspaceId, employeeId);

      return record;
    },
    [loadRecordsForEmployee]
  );

  const deleteRecordForEmployee = useCallback(async (workspaceId, employeeId, recordId) => {
    if (!workspaceId || !employeeId) {
      throw new Error('근태 기록을 삭제하려면 워크스페이스와 직원을 선택하세요.');
    }

    await attendanceApi.deleteRecord(workspaceId, recordId);
    await loadRecordsForEmployee(workspaceId, employeeId);

    return true;
  }, [loadRecordsForEmployee]);

  const value = useMemo(() => {
    const workspaceRecords = selectedWorkspaceId ? registry[selectedWorkspaceId] ?? {} : {};

    const getRecordsForEmployee = (employeeId) => workspaceRecords[employeeId] ?? [];

    return {
      getRecordsForEmployee,
      registerRecord: (employeeId, input) =>
        registerRecordForEmployee(selectedWorkspaceId, employeeId, input),
      updateRecord: (employeeId, recordId, updates) =>
        updateRecordForEmployee(selectedWorkspaceId, employeeId, recordId, updates),
      removeRecord: (employeeId, recordId) =>
        deleteRecordForEmployee(selectedWorkspaceId, employeeId, recordId),
      loadRecords: (employeeId) => loadRecordsForEmployee(selectedWorkspaceId, employeeId),
      isLoadingRecords: (employeeId) => {
        if (!selectedWorkspaceId || !employeeId) {
          return false;
        }

        const key = buildLoadingKey(selectedWorkspaceId, employeeId);
        return loadingMap[key] ?? false;
      },
      recordError: (employeeId) => {
        if (!selectedWorkspaceId || !employeeId) {
          return null;
        }

        const key = buildLoadingKey(selectedWorkspaceId, employeeId);
        return errorMap[key] ?? null;
      },
      hasRecords: Object.values(workspaceRecords).some((records) => (records?.length ?? 0) > 0)
    };
  }, [
    deleteRecordForEmployee,
    errorMap,
    loadRecordsForEmployee,
    loadingMap,
    registerRecordForEmployee,
    registry,
    selectedWorkspaceId,
    updateRecordForEmployee
  ]);

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};
