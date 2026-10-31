/**
 * Catches any request that doesn't match a defined route and forwards
 * a 404 error to globalErrorHandler.
 */
function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

module.exports = notFoundHandler;
