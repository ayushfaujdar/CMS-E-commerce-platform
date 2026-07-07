export function notFound(req, res, _next) {
  res.status(404).json({ message: `Not found: ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  const status = err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: err.message || 'Server error',
  });
}
