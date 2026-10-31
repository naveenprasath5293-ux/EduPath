const { validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/**
 * Runs after a route's validator chain. Collects express-validator
 * errors into the shape used across the API and forwards to
 * globalErrorHandler instead of each controller checking manually.
 */
function validateRequest(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = result.array().map((err) => ({
    field: err.path,
    message: err.msg,
  }));

  next(ApiError.unprocessable('Validation failed', errors));
}

module.exports = validateRequest;
