import { useContext } from 'react';
import { EmployeesContext } from '../context/EmployeesContext.js';

export const useEmployees = () => {
  const context = useContext(EmployeesContext);

  if (!context) {
    throw new Error('useEmployees 훅은 EmployeesProvider 내부에서만 사용할 수 있습니다.');
  }

  return context;
};
