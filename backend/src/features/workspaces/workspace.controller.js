import { workspaceService } from './workspace.service.js';

export const listWorkspaces = async (_req, res, next) => {
  try {
    const workspaces = await workspaceService.listWorkspaces();
    return res.json({ workspaces });
  } catch (error) {
    return next(error);
  }
};

export const createWorkspace = async (req, res, next) => {
  try {
    const { name, industry, underFive, roles } = req.body ?? {};

    if (!name?.trim() || !industry?.trim()) {
      return res.status(400).json({ message: '매장명과 업종을 입력해 주세요.' });
    }

    const workspace = await workspaceService.createWorkspace({
      name,
      industry,
      underFive,
      roles
    });

    return res.status(201).json({ workspace });
  } catch (error) {
    return next(error);
  }
};
