import { Router } from 'express';
import {
  listEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from './employee.controller.js';

export const employeeRouter = Router({ mergeParams: true });

employeeRouter.get('/', listEmployees);
employeeRouter.post('/', createEmployee);
employeeRouter.put('/:employeeId', updateEmployee);
employeeRouter.delete('/:employeeId', deleteEmployee);
