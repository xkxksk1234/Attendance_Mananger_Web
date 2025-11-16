import { useCallback, useMemo, useState } from 'react';
import { attendanceApi } from '../../api/attendanceApi.js';
import { useStore } from '../../hooks/useStore.js';
import { AttendanceContext } from './AttendanceContext.js';

const buildLoadingKey = (storeId, employeeId) => `${storeId}:${employeeId}`;

export const AttendanceProvider = ({ children }) => {
  const { selectedStoreId } = useStore();
  const [registry, setRegistry] = useState({});
  const [loadingMap, setLoadingMap] = useState({});
  const [errorMap, setErrorMap] = useState({});

  const loadRecordsForEmployee = useCallback(async (storeId, employeeId) => {
    if (!storeId || !employeeId) {
      return [];
    }

    const key = buildLoadingKey(storeId, employeeId);
    setLoadingMap((prev) => ({ ...prev, [key]: true }));

    try {
      const records = await attendanceApi.fetchRecords(storeId, employeeId);
      setRegistry((prev) => ({
        ...prev,
        [storeId]: {
          ...(prev[storeId] ?? {}),
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
    async (storeId, employeeId, input) => {
      if (!storeId) {
        throw new Error('매장을 선택한 후 근태 기록을 등록할 수 있습니다.');
      }

      if (!employeeId) {
        throw new Error('직원을 선택한 후 근태 기록을 등록할 수 있습니다.');
      }

      const record = await attendanceApi.createRecord(storeId, {
        ...input,
        employeeId
      });

      await loadRecordsForEmployee(storeId, employeeId);

      return record;
    },
    [loadRecordsForEmployee]
  );

  const updateRecordForEmployee = useCallback(
    async (storeId, employeeId, recordId, updates) => {
      if (!storeId || !employeeId) {
        throw new Error('근태 기록을 수정하려면 매장과 직원을 선택하세요.');
      }

      const record = await attendanceApi.updateRecord(storeId, recordId, updates);
      await loadRecordsForEmployee(storeId, employeeId);

      return record;
    },
    [loadRecordsForEmployee]
  );

  const deleteRecordForEmployee = useCallback(async (storeId, employeeId, recordId) => {
    if (!storeId || !employeeId) {
      throw new Error('근태 기록을 삭제하려면 매장과 직원을 선택하세요.');
    }

    await attendanceApi.deleteRecord(storeId, recordId);
    await loadRecordsForEmployee(storeId, employeeId);

    return true;
  }, [loadRecordsForEmployee]);

  const storeRecords = selectedStoreId ? registry[selectedStoreId] ?? {} : {};

  const getRecordsForEmployee = useCallback(
    (employeeId) => storeRecords[employeeId] ?? [],
    [storeRecords]
  );

  const registerRecord = useCallback(
    (employeeId, input) => registerRecordForEmployee(selectedStoreId, employeeId, input),
    [registerRecordForEmployee, selectedStoreId]
  );

  const updateRecord = useCallback(
    (employeeId, recordId, updates) =>
      updateRecordForEmployee(selectedStoreId, employeeId, recordId, updates),
    [selectedStoreId, updateRecordForEmployee]
  );

  const removeRecord = useCallback(
    (employeeId, recordId) => deleteRecordForEmployee(selectedStoreId, employeeId, recordId),
    [deleteRecordForEmployee, selectedStoreId]
  );

  const loadRecords = useCallback(
    (employeeId) => loadRecordsForEmployee(selectedStoreId, employeeId),
    [loadRecordsForEmployee, selectedStoreId]
  );

  const isLoadingRecords = useCallback(
    (employeeId) => {
      if (!selectedStoreId || !employeeId) {
        return false;
      }

      const key = buildLoadingKey(selectedStoreId, employeeId);
      return loadingMap[key] ?? false;
    },
    [loadingMap, selectedStoreId]
  );

  const recordError = useCallback(
    (employeeId) => {
      if (!selectedStoreId || !employeeId) {
        return null;
      }

      const key = buildLoadingKey(selectedStoreId, employeeId);
      return errorMap[key] ?? null;
    },
    [errorMap, selectedStoreId]
  );

  const value = useMemo(
    () => ({
      getRecordsForEmployee,
      registerRecord,
      updateRecord,
      removeRecord,
      loadRecords,
      isLoadingRecords,
      recordError,
      hasRecords: Object.values(storeRecords).some((records) => (records?.length ?? 0) > 0)
    }),
    [
      getRecordsForEmployee,
      registerRecord,
      updateRecord,
      removeRecord,
      loadRecords,
      isLoadingRecords,
      recordError,
      storeRecords
    ]
  );

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
};
