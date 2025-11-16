import { Router } from 'express';
import { authenticateRequest } from '../auth/auth.middleware.js';
import { listStores, createStore } from './store.controller.js';
import { employeeRouter } from '../employees/employee.router.js';
import { attendanceRouter } from '../attendance/attendance.router.js';

export const storesRouter = Router();

storesRouter.use(authenticateRequest);

storesRouter.get('/', listStores);
storesRouter.post('/', createStore);
storesRouter.use('/:storeId/employees', employeeRouter);
storesRouter.use('/:storeId/attendance', attendanceRouter);
