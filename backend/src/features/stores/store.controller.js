import { storeService } from './store.service.js';

const parseStoreId = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const listStores = async (req, res, next) => {
  try {
    const stores = await storeService.listStores(req.auth.sub);
    return res.json({ stores });
  } catch (error) {
    return next(error);
  }
};

export const createStore = async (req, res, next) => {
  try {
    const { name, industry, underFive, roles } = req.body ?? {};
    const ownerId = req.auth.sub;

    if (!name?.trim() || !industry?.trim()) {
      return res.status(400).json({ message: '매장명과 업종을 입력해 주세요.' });
    }

    const store = await storeService.createStore(ownerId, {
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

export const deleteStore = async (req, res, next) => {
  try {
    const ownerId = req.auth.sub;
    const storeId = parseStoreId(req.params.storeId);

    if (!storeId) {
      return res.status(400).json({ message: '삭제할 매장을 선택해 주세요.' });
    }

    const deleted = await storeService.deleteStore(ownerId, storeId);

    if (!deleted) {
      return res.status(404).json({ message: '삭제할 매장을 찾을 수 없습니다.' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
