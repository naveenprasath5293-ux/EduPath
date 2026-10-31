const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { User } = require('../models/User.model');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('./asyncHandler');

/**
 * Reads the JWT from the httpOnly auth cookie (single-token approach -
 * no Authorization header, per the "one consistent approach"
 * requirement), verifies it, and attaches the authenticated user to
 * req.user for downstream handlers/middleware.
 */
const authenticateUser = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.[env.cookie.name];

  if (!token) {
    throw ApiError.unauthorized('You must be logged in to access this resource');
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwt.secret);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired authentication token');
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw ApiError.unauthorized('User no longer exists');
  }
  if (!user.isActive) {
    throw ApiError.forbidden('This account has been deactivated');
  }

  req.user = user;
  next();
});

module.exports = authenticateUser;
