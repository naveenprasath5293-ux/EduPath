const env = require('./env');

/**
 * CORS options - restricted to the configured client origin, with
 * credentials enabled since Phase 2 will rely on an httpOnly cookie
 * for refresh tokens.
 */
module.exports = {
  origin: env.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
