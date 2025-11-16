import { Router } from 'express';
import { authenticateRequest } from '../auth/auth.middleware.js';
import { listWorkspaces, createWorkspace } from './workspace.controller.js';
import { employeeRouter } from '../employees/employee.router.js';
import { attendanceRouter } from '../attendance/attendance.router.js';

export const workspacesRouter = Router();

workspacesRouter.use(authenticateRequest);

workspacesRouter.get('/', listWorkspaces);
workspacesRouter.post('/', createWorkspace);
workspacesRouter.use('/:workspaceId/employees', employeeRouter);
workspacesRouter.use('/:workspaceId/attendance', attendanceRouter);
