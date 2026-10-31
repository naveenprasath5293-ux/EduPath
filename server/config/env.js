require('dotenv').config();

const required = ['JWT_SECRET'];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  // eslint-disable-next-line no-console
  console.error(`[env] Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

/**
 * Centralized access to environment variables.
 */
module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_course_management',
  isProduction: (process.env.NODE_ENV || 'development') === 'production',

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },

  cookie: {
    name: process.env.AUTH_COOKIE_NAME || 'token',
    maxAgeMs: Number(process.env.AUTH_COOKIE_MAX_AGE_MS) || 24 * 60 * 60 * 1000, // 1 day
  },
};
