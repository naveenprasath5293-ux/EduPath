/**
 * Standard application error. Thrown from services/controllers and
 * caught by globalErrorHandler, which knows how to serialize it into
 * a consistent JSON shape.
 */
class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Resource already exists') {
    return new ApiError(409, message);
  }

  static unprocessable(message = 'Validation failed', errors = []) {
    return new ApiError(422, message, errors);
  }
}

module.exports = ApiError;
