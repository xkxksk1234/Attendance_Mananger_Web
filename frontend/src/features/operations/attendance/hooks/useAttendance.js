import { useContext } from 'react';
import { AttendanceContext } from '../context/AttendanceContext.js';

export const useAttendance = () => {
  const context = useContext(AttendanceContext);

  if (!context) {
    throw new Error('useAttendance 훅은 AttendanceProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};
