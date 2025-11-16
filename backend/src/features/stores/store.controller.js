import { storeService } from './store.service.js';

export const listStores = async (_req, res, next) => {
  try {
    const stores = await storeService.listStores();
    return res.json({ stores });
  } catch (error) {
    return next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const { name, industry, underFive, roles } = req.body ?? {};

    if (!name?.trim() || !industry?.trim()) {
      return res.status(400).json({ message: '매장명과 업종을 입력해 주세요.' });
    }

    const store = await storeService.createStore({
      name,
      industry,
      underFive,
      roles
    });

    return res.status(201).json({ store });
  } catch (error) {
    return next(error);
  }
};
