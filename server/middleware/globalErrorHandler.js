const multer = require('multer');
const ApiError = require('../utils/ApiError');
const env = require('../config/env');

/**
 * Catches every error forwarded via next(err), normalizes known error
 * types (ApiError, Mongoose validation/cast/duplicate-key errors, JWT
 * errors) into a consistent JSON shape, and never leaks stack traces
 * in production.
 */
// eslint-disable-next-line no-unused-vars
function globalErrorHandler(err, req, res, next) {
  let error = err;

  if (!(error instanceof ApiError)) {
    if (error instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: 'Thumbnail image must be 2 MB or smaller',
        LIMIT_UNEXPECTED_FILE: 'Unexpected file field in upload',
      };
      error = ApiError.badRequest(messages[error.code] || `Upload error: ${error.message}`);
    } else if (error.name === 'ValidationError' && error.errors) {
      // Mongoose schema validation error
      const errors = Object.values(error.errors).map((e) => ({ field: e.path, message: e.message }));
      error = ApiError.unprocessable('Validation failed', errors);
    } else if (error.name === 'CastError') {
      error = ApiError.badRequest(`Invalid value for field: ${error.path}`);
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      error = ApiError.conflict(`An account with this ${field} already exists`);
    } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      error = ApiError.unauthorized('Invalid or expired authentication token');
    } else {
      const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;
      error = new ApiError(statusCode, error.message || 'Internal server error');
    }
  }

  if (!env.isProduction && error.statusCode >= 500) {
    // eslint-disable-next-line no-console
    console.error('[error]', err);
  }

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    errors: error.errors && error.errors.length ? error.errors : undefined,
    stack: env.isProduction ? undefined : err.stack,
  });
}

module.exports = globalErrorHandler;
