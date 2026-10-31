const rateLimit = require('express-rate-limit');

/**
 * Baseline app-wide rate limiter.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests. Please try again later.',
  },
});

/**
 * Stricter limiter applied only to sensitive auth endpoints
 * (login/register/admin login) to slow down brute-force and
 * credential-stuffing attempts.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many attempts. Please try again in a few minutes.',
  },
});

module.exports = { apiLimiter, authLimiter };
