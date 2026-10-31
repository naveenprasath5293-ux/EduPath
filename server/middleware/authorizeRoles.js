const ApiError = require('../utils/ApiError');

/**
 * Restricts a route to one or more roles. Must run after
 * authenticateUser so req.user is already populated.
 * @param  {...('student'|'admin')} roles
 */
function authorizeRoles(...roles) {
  return function authorize(req, res, next) {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }
    return next();
  };
}

module.exports = authorizeRoles;
