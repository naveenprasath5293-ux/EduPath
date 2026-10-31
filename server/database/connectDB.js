const mongoose = require('mongoose');
const env = require('../config/env');

let isConnected = false;

/**
 * Connects to MongoDB via Mongoose. Phase 1 wires this up so the
 * server boots against a real database connection, but no models or
 * schemas are defined yet - that begins in Phase 2.
 */
async function connectDB() {
  if (isConnected) return mongoose.connection;

  try {
    mongoose.set('strictQuery', true);
    const conn = await mongoose.connect(env.mongoUri);
    isConnected = true;

    // eslint-disable-next-line no-console
    console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error('[db] Connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      // eslint-disable-next-line no-console
      console.warn('[db] MongoDB disconnected');
    });

    return conn;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[db] Initial connection failed:', err.message);
    // Do not crash the whole process in Phase 1 - there are no DB-backed
    // features yet, so log clearly and let the API stay up for the
    // health check. Phase 2 can tighten this once persistence matters.
    return null;
  }
}

module.exports = connectDB;
