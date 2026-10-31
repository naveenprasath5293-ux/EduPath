const { User, ROLES } = require('../models/User.model');
const jwtService = require('./jwt.service');
const ApiError = require('../utils/ApiError');

async function registerStudent(data) {
  const email = data.email.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const user = await User.create({
    fullName: data.fullName,
    email,
    password: data.password,
    phone: data.phone,
    role: ROLES.STUDENT,
  });

  const token = jwtService.generateToken({ id: user._id.toString(), role: user.role });
  return { user: user.toSafeObject(), token };
}

/**
 * Shared login logic for both student and admin login. `expectedRole`
 * ensures students can never authenticate through the admin endpoint
 * and vice versa, even with otherwise-valid credentials.
 */
async function login(email, password, expectedRole) {
  const user = await User.findOne({ email: email.toLowerCase(), role: expectedRole }).select('+password');

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }
  if (!user.isActive) {
    throw ApiError.forbidden('This account has been deactivated. Contact support.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = jwtService.generateToken({ id: user._id.toString(), role: user.role });
  return { user: user.toSafeObject(), token };
}

async function getProfile(userId) {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound('User not found');
  return user.toSafeObject();
}

async function updateProfile(userId, updates) {
  // Whitelist explicitly - never allow role/password/email changes here.
  const allowed = ['fullName', 'phone', 'profileImage'];
  const payload = {};
  allowed.forEach((key) => {
    if (updates[key] !== undefined) payload[key] = updates[key];
  });

  const user = await User.findByIdAndUpdate(userId, { $set: payload }, {
    new: true,
    runValidators: true,
  });

  if (!user) throw ApiError.notFound('User not found');
  return user.toSafeObject();
}

module.exports = {
  registerStudent,
  login,
  getProfile,
  updateProfile,
};
