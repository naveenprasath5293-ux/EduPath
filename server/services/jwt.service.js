const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * @param {{ id: string, role: string }} payload
 */
function generateToken(payload) {
  return jwt.sign(payload, env.jwt.secret, { expiresIn: env.jwt.expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, env.jwt.secret);
}

module.exports = { generateToken, verifyToken };
