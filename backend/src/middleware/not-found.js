export const notFoundHandler = (_req, res, _next) => {
  res.status(404).json({ message: '요청하신 리소스를 찾을 수 없습니다.' });
};
