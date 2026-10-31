/**
 * Bootstraps the first Admin account. There is no public
 * /api/auth/admin/register endpoint by design - run this once per
 * environment.
 *
 * Usage: npm run seed:admin
 */
require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const { User, ROLES } = require('../models/User.model');

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@edupath.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const fullName = process.env.ADMIN_FULL_NAME || 'System Administrator';
  const phone = process.env.ADMIN_PHONE || '0000000000';

  await mongoose.connect(env.mongoUri);

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seedAdmin] Admin already exists for ${email}. No changes made.`);
    await mongoose.disconnect();
    return;
  }

  await User.create({
    fullName,
    email,
    password,
    phone,
    role: ROLES.ADMIN,
    isActive: true,
    isEmailVerified: true,
  });

  console.log(`[seedAdmin] Admin account created for ${email} (password: ${password})`);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('[seedAdmin] Failed:', err);
  process.exit(1);
});
