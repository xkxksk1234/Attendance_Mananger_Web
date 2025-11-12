export const errorHandler = (err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  if (err?.status && err?.message) {
    return res.status(err.status).json({
      message: err.message,
      ...(err.details ? { details: err.details } : {})
    });
  }

  return res.status(500).json({ message: '서버 내부 에러가 발생했습니다.' });
};
